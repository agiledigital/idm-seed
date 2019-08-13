import each from 'jest-each';
import openidmLib from './openidm-lib';

export const clearAll = () => describe('Clearing all existing data in OpenIDM', () =>
    each`
        name                  | resource
        ${"Users"}            | ${openidmLib.managed.users}
        ${"Pending Rel"}      | ${openidmLib.managed.pendingRelationships}
        ${"User CSV"}         | ${openidmLib.system.usersWithManagers.users}
        ${"Links"}            | ${openidmLib.links}
    `.test('$name should be reset to be empty', async ( { resource} ) => {
        await resource.deleteAll();
        const result =  await resource.getAll().expect(200)
        expect(result.body.resultCount).toBe(0);
    }, 15000)
);