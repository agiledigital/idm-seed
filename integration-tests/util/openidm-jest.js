const superagent = require('superagent')
const config = require('config')
const intConfig= config.get("integrationTesting");
const baseUrl = `${intConfig.baseUrl}/openidm`

function addAuth(request) {
    return request.set({
        "X-OpenIDM-Username": intConfig.auth.username,
        "X-OpenIDM-Password": intConfig.auth.password
    })
}

exports.openidm = {
    read: async (
        resourceName,
        params,
        fields
    ) => {
        const query = fields ? { _fields: fields} : {}
        const resp = await addAuth(superagent
            .get(`${baseUrl}/${resourceName}`)
            .query(query))

        return resp.body
    },
    query: async (
        resourceName,
        params,
        fields
        ) => {
        const query = { ...params, _fields: fields }
        // console.log("Running query",query,resourceName)
        const resp = await addAuth(superagent
            .get(`${baseUrl}/${resourceName}`)
            .query(query))

        return resp.body
    },
    delete: async (
        resourceName,
        params,
        fields) => {
        const query = fields ? { _fields: fields} : {}
        // console.log("About to execute delete", `${baseUrl}/${resourceName}`)
        const resp = await addAuth(superagent
            .delete(`${baseUrl}/${resourceName}`)
            .query(query))

        return resp.body
    },
    create: async (
        resourceName,
        newResourceId,
        content,
        params,
        fields
    ) => {
        // api.post(path).send(object);
        const query = fields ? { _fields: fields} : {}
        if (newResourceId) {
            content._id = newResourceId
        }
        const resp = await addAuth(superagent
            .delete(`${baseUrl}/${resourceName}`)
            .query(query))
            .send(content)

        return resp.body
    }
}