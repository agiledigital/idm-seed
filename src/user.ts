import { allOf, equals, not, presence } from "@agiledigital/idm-ts-types/lib/query-filter";
import { idm, ManagedUser, SystemUsersWithManagersAccount } from "lib/idm";
import { getLogger } from "./common";

const logger = getLogger("seed.script.user");

export const MAXIMUM_PASSWORD_HISTORY = 24;

/**
 * The algorithm used to store the password history.
 *
 * We are using SHA-512 because although PBKDF2 would be nice, it is far too slow for password history of length 24.
 * As PKBDF2 takes about 150ms whereas SHA-512 is about 0-1ms. 150 * 24 = 3600 (3.6 seconds) which isn't workable.
 */
export const PASSWORD_HISTORY_ALGORITHM = "SHA-512";

export const asyncLinkManager = (managedUser: ManagedUser) => {
  // Find out if there are any pending relationships
  const pending = idm.managed.pendingRelationships.query({ filter: allOf(
    equals("targetCollection", idm.managed.user.type),
    equals("targetUniqueKey", managedUser.userName),
    not(presence("actionTime"))
  )});

  pending.result.forEach(pendingRel => {
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
      oldPendingRelationships.result.forEach(rel => idm.managed.pendingRelationships.delete(rel._id, null));
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

export function findUserByUserName(userName: string): ManagedUser;
export function findUserByUserName(userName: string, returnUndefined: boolean): ManagedUser | undefined;
export function findUserByUserName(userName: string, returnUndefined = false): ManagedUser | undefined {
  const userRes = idm.managed.user.query({ filter: equals("userName", userName) }, { unCheckedFields: ["*", "*_ref"] });
  const user = userRes.result?.[0];
  if (!user && !returnUndefined) {
    throw new Error(`Couldn't find user [${userName}]`);
  }
  return user;
}

/**
 * Update the Password History and figure out if the current password is different to the current password
 *
 * @param object The managed user object with the password value in it
 * @returns true if the password is different than the current password, false if the password is the same and can be ignored
 */
 function updatePasswordHistory(object: ManagedUser): boolean {
  // Create the new history array if it doesn't already exist
  if (object.passwordHistory === undefined || object.passwordHistory === null) {
    object.passwordHistory = new Array(MAXIMUM_PASSWORD_HISTORY)
  }

  // Check if the password is different to the last changed password if it's different then store it
  const lastPassword = object.passwordHistory[object.passwordHistory.length - 1]
  if (!(openidm.isHashed(lastPassword) && openidm.matches(object.password as string, lastPassword))) {
    // Remove the oldest entry from the front
    object.passwordHistory.shift()

    // Add the new password to the end
    object.passwordHistory.push(openidm.hash(object.password, PASSWORD_HISTORY_ALGORITHM))

    // This is a new password, so accept it
    return true
  } else {
    // This password is the same as the current password, so ignore it
    return false
  }
}

function handlePasswordChange(object: ManagedUser, context?: RequestContext): void {
  const isPasswordDifferent = updatePasswordHistory(object)

  const passwordChangeUser = context?.security?.authenticationId ?? "unknown"

  if (isPasswordDifferent) {
    // If there is a password set, then we should also set the last password change to the current time.
    object.lastPasswordChange = new Date().toISOString()

    // Grab the user that changed the password, so that we can prevent syncing password back to the AD that originated the change
    object.lastPasswordChangeUser = passwordChangeUser

    logger.debug("Accepting password change for {} from {}", object.userName, object.lastPasswordChangeUser)
  } else {
    if (logger.isDebugEnabled()) {
      logger.debug(
        "Skipping password change for user {} by [{}] as it is the same as the current password, last changed on [{}]",
        object.userName,
        passwordChangeUser,
        object.lastPasswordChange ? new Date(object.lastPasswordChange).toString() : "unknown"
      )
    }
    delete object.password
  }
}

/**
 * This is called from the onCreate/onUpdate of the Managed User object.
 *
 * @param object The Managed User that is being changed
 * @param context The context which contains which user 
 */
 export function managedUserOnChange(object: ManagedUser, context: any, oldObject?: ManagedUser): void {
  if (object.password) {
    handlePasswordChange(object, context)
  }
}