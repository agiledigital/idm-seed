import { idm, ManagedUser } from "lib/idm";

export const findOrCreateUserRelationship = (userName: string) => {
  logger.info(`Linking to ${userName}`);
  return { _ref: `managed/managedUser/${userName}` };
};

export const sonartsFailure = () => {
  const test = ["first", "second", "third"]

  var curTest
  // tslint:disable-next-line: no-conditional-assignment
  while (curTest = test.pop()) {
    logger.info(`Current Test Value ${curTest}`)
  }
}

/**
 * Count the number of users who directly and indirectly report to the given user.
 *
 * @param {string} userId The managed user id to count the number of reports on.
 */
export const countReports = function(userId) {
  const searchQueue: string[] = [];
  // Initialise the search with the given user
  searchQueue.push(userId);

  var reports = 0;
  var curUserId;

  // tslint:disable-next-line: no-conditional-assignment
  while ((curUserId = searchQueue.pop())) {
    const curUser = idm.managed.user.read(curUserId, {
      fields: ["_id", "reports"]
    });

    if (curUser && curUser.reports) {
      _.each(curUser.reports, reportsUser => {
        if (reportsUser._refResourceId) {
          // Count each user who report to the current user
          reports++;

          // Lets search that user too
          searchQueue.push(reportsUser._refResourceId);
        }
      });
    }
  }
  return reports;
};
