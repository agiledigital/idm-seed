import each from 'jest-each'
import idm from 'lib/idm';
import * as adAccounts from '../data/adAccounts'
import * as usersWithManagers from '../data/usersWithManagers'
import { clearAll } from '../util/common'
import openidmLib from '../util/openidm-lib'

function sleep(ms){
    return new Promise( resolve => setTimeout(resolve,ms) );
}

// The openidm wrapper APIs are not asynchronous, either is the normal implementation
// of the original openidm Java API, but implementing it as async for jest seems to
// work ok, although tslint thinks it's an invalid await, because the typescript types
// don't say the implementation is async.
// tslint:disable: no-invalid-await

// describe('testing', () => {
//     test('test1', async () => {
//         const foo = await idm.managed.user.read("user1",{fields: ["sn","manager"]});
//         // tslint:disable-next-line: no-console
//         if (foo.manager)
//         console.log(foo.manager, foo.manager.sn)
//         expect(foo._id).toBeTruthy();

//         const bob = await idm.managed.user.query(
//             { _queryFilter: `userName eq "user1"` },
//             {
//                 unCheckedFields: ["manager/sn"],
//             }
//         )
//         console.log(bob)
//         if (bob.result[0] && bob.result[0].manager) {
//             console.log(bob.result[0].manager.sn)
//         }
//     });
// })

clearAll();
describe('Loading data', () => {
    each`
        name                    | values                                  | resource
        ${"User accounts"}      | ${usersWithManagers.initialValues}      | ${openidmLib.system.usersWithManagers.users}
    `.test('loading $name data', async ( { values, resource }) => {
        const result = await resource.createAll(values);
        const failures = result.filter(item => item.status !== 201);
        expect(failures.length).toBe(0);
    });
});

describe('Run full reconciliation pipeline', () => {
    test('Run csv to managed user mapping', async () => {
        const status = await openidmLib.mapping.start().then(res => res.body);
        expect(status.state).toBe('SUCCESS');

        // We should have some pending relationships
        const pending = await idm.managed.pendingRelationships.query({_queryFilter: "true"},{fields: ["actionTime"]})
        // openidmLib.managed.pendingRelationships.getAll("actionTime")
        expect(pending.resultCount).toBeGreaterThan(0)

        // Check that all the pending relationships have been actioned 
        expect(pending.result.filter(p => !Date.parse(p.actionTime ? p.actionTime : "")).length).toBe(0)
    }, 30000);
    
    test('Run csv to managed user mapping again, pending should clear', async () => {
        const status = await openidmLib.mapping.start().then(res => res.body);
        expect(status.state).toBe('SUCCESS');

        const pending = await openidmLib.managed.pendingRelationships.getAll("_id")
        expect(pending.body.resultCount).toBe(0)
    }, 30000);
});