import { ManagedUser } from "lib/idm";

// tslint:disable
export const inject = function(path: string) {
  // Allow mocks to be injected via a global 'injectedGlobalMocks' variable for unit tests
  if (typeof injectedGlobalMocks != "undefined") {
    const mock = injectedGlobalMocks[path];
    return mock;
    var foo: ManagedUser;
  }
};
