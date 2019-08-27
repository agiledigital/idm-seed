import config from 'config';
import defaults from 'superagent-defaults';
import supertest from 'supertest';

const intConfig: Record<string, any> = config.get("integrationTesting");

const api: supertest.SuperTest<supertest.Test> = defaults(supertest(`${intConfig.baseUrl}/openidm`))
    .set({
        "X-OpenIDM-Username": intConfig.auth.username,
        "X-OpenIDM-Password": intConfig.auth.password
    });

// TODO: Try and convert this over to the openidm object...
// const resource = (path, queryFilter?) => {
//     const query: QueryFilter | QueryIdParams = queryFilter ? { _queryFilter: queryFilter} : { _queryId: "query-all-ids" };
//     const strippedPath = path.replace(/^\/+/, '')
//     const getAll = async (maybeFields?: string[]) => {
//         const fields: string[] = maybeFields || ["_id","_rev"]
//         return openidm.query(strippedPath, query, fields)
//     }

//     const deleteSingle = (object: IDMBaseObject) => openidm.delete(`${strippedPath}/${object._id}`);

//     const deleteMany = (objectOrArray) => sequenceIfArray(objectOrArray, deleteSingle);

//     // const deleteAll = () => getAll().result.forEach(item => deleteMany(item));
//     const deleteAll = () => getAll().then(result => deleteMany(result));


//     const createSingle = (object): Result => openidm.create(strippedPath,null,object);// api.post(path).send(object);

//     const create = (objectOrArray) => sequenceIfArray(objectOrArray.slice(), createSingle);

//     return {
//         getAll, deleteAll, create
//     };
// }

const resource = (path, queryFilter?) => {
    const query = queryFilter ? `_queryFilter=${queryFilter}` : "_queryId=query-all-ids";
    const getAll = (maybeFields?) => {
        const fields = maybeFields || "_id,_rev"
        return api.get(`${path}?_fields=${fields}&${query}`)
    }

    const deleteSingle = (object) => api.delete(`${path}/${object._id}`);

    const deleteAll = () => getAll().then(result => Promise.all(result.body.result.map(deleteSingle)))

    const createSingle = (object) => api.post(path).send(object);

    const createAll = (objects: Record<string, any>[]) => Promise.all(objects.map(createSingle))

    return {
        getAll, deleteAll, createAll
    };
}

const connector = (system, object, queryFilter?) => resource(`/system/${system}/${object}`, queryFilter);
const managed = (object, queryFilter?) => resource(`/managed/${object}`, queryFilter);

const positionsDN = "OU=Positions,OU=IDM,OU=Groups,OU=IntegrationTesting,DC=ad,DC=domain";
const orgUnitsDN = "OU=Org Units,OU=IDM,OU=Groups,OU=IntegrationTesting,DC=ad,DC=domain"
const openidmLib = {
    api,
    system: {
        ad: {
            users: connector("ActiveDirectory", "account"),
            groups: connector("ActiveDirectory", "group"),
            positions: connector("ActiveDirectory", "group", "cn sw 'POS_'"),
            orgUnits: connector("ActiveDirectory", "group", "cn sw 'ORG_'")
        },
        usersWithManagers: {
            users: connector("UsersWithManagers", "__ACCOUNT__")
        },
        oracle: {
            users: connector("OracleStaff", "__ACCOUNT__", "__NAME__ gt 90000000"),
            groups: connector("OracleOrgGroups", "__ACCOUNT__", "DESCRIPTION sw '[Integration Testing] '"),
        }
    },
    managed: {
        orgUnits: managed("OrgUnit"),
        users: managed("user"),
        positions: managed("Position"),
        groups: managed("Group"),
        pendingRelationships: managed("pendingRelationships", true),
    },
    links: resource("/repo/link"),
    reconPipeline: {
        status: () => api.get('/endpoint/reconPipeline/status'),
        start: (mapping?) => api.get('/endpoint/reconPipeline/start').query({mappingName: mapping || "systemOrgunits__ACCOUNT___managedOrgunit"})
    },
    mapping: {
        start: () => api.post('/recon').query({_action: "recon", mapping: "systemUserswithmanagers__ACCOUNT___managedUser", waitForCompletion: true}) 
    }
};

export default openidmLib;

module.exports = openidmLib