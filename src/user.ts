import { allOf, equals, not, presence } from "@agiledigital/idm-ts-types/lib/query-filter";
import { idm, ManagedUser, SystemUsersWithManagersAccount } from "lib/idm";
import _ from "lib/lodash";
import { getLogger } from "./common";

const logger = getLogger("seed.script.user");

export const asyncLinkManager = (managedUser: ManagedUser) => {
  // Find out if there are any pending relationships
  const params = {
    _queryFilter: `targetCollection eq '${idm.managed.user.type}' and targetUniqueKey eq '${managedUser.userName}' and !(actionTime pr)`
  };
  const pending = idm.managed.pendingRelationships.query({ filter: allOf(
    equals("targetCollection", idm.managed.user.type),
    equals("targetUniqueKey", managedUser.userName),
    not(presence("actionTime"))
  )});

  _(pending.result).forEach(pendingRel => {
    // Use the specified filter if it exists, otherwise assume the uniqueKey is the _id
    const query = pendingRel.sourceQueryFilter ? pendingRel.sourceQueryFilter : `_id eq '${pendingRel.sourceUniqueKey}'`;
    const results = openidm.query(pendingRel.sourceCollection, { _queryFilter: query }, ["_id"]);

    if (results.result.length > 1 || results.result.length === 0) {
      logger.error("Expecting to find 1 result for pending relationship {}, but got {}", pendingRel, results.result.length);
    } else {
      const sourceId = results.result[0]._id;
      const patch: PatchOpts[] = [
        {
          field: pendingRel.sourceRelationshipProperty,
          operation: "replace",
          value: { _ref: pendingRel.targetCollection + "/" + managedUser._id }
        },
        {
          field: "safeToSync",
          operation: "replace",
          value: true
        }
      ];
      const resourceName = pendingRel.sourceCollection + "/" + sourceId;
      // logger.info("Attempting to patch {} with {}", resourceName, JSON.stringify(patch,null,2))
      openidm.patch(resourceName, null, patch);

      // If patch is successful then we can delete the pending relationship
      logger.info("About to mark the pending relationship as actioned {} because user {} found it.", pendingRel, managedUser._id);
      //   idm.managed.pendingRelationships.delete(pendingRel._id, null);
      idm.managed.pendingRelationships.patch(pendingRel._id, pendingRel._rev, [
        {
          field: "actionTime",
          operation: "replace",
          value: new Date().toISOString()
        }
      ]);
    }
  });
};

export const linkManager = (source: SystemUsersWithManagersAccount, target: ManagedUser) => {
  if (source.Manager) {
    const managerObj = idm.managed.user.read(source.Manager, {
      fields: ["_id"]
    });
    logger.info("Looking for manager {} found? {}", source.Manager, managerObj !== null);
    if (managerObj) {
      // The manager exists already, lets link straight away
      target.manager = idm.managed.user.relationship(source.Manager);
      target.safeToSync = true;

      // Delete any pending relationships, incase they are sitting around, but it could be a different manager,
      // so leave out the unique key
      const oldPendingRelationships = idm.managed.pendingRelationships.query(
        {
          filter: allOf(
            equals("targetCollection", idm.managed.user.type),
            equals("sourceCollection", idm.managed.user.type),
            equals("sourceRelationshipProperty", "manager"),
            equals("sourceUniqueKey", target.userName)
          )
        },
        {
          fields: ["_id"]
        }
      );
      _.chain(oldPendingRelationships.result)
        .pluck("_id")
        .map((id: string) => idm.managed.pendingRelationships.delete(id, null));
    } else {
      // The manager doesn't exist yet, so we will link it up later
      idm.managed.pendingRelationships.create(null, {
        creationTime: new Date().toISOString(),
        sourceCollection: idm.managed.user.type,
        sourceRelationshipProperty: "manager",
        sourceUniqueKey: target.userName,
        targetCollection: idm.managed.user.type,
        targetUniqueKey: source.Manager
      });
    }
  } else {
    // There is no manager so lets mark the user as safe to sync
    target.safeToSync = true;
  }
};
