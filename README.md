# ForgeRock IDM Seed Project

The ForgeRock IDM Seed Project is a sample ForgeRock IDM project that shows off the TypeScript code generation from the [ForgeRock IDM TypeScript Types](https://github.com/agiledigital/idm-ts-types) while still targeting the Rhino JavaScript engine that ForgeRock IDM uses.

The key benefits are:
* Type Safety – We've put together some TypeScript types that wrap the IDM API to ensure that all your calls to the API are type safe, plus you get the added benefit of getting type-ahead assistance from your IDE.
* Integration Testing – Write end-to-end integration tests that work on real connectors, complete with test data clean-up and data generation.  Now you can have even greater levels of confidence with each deployment. 
* Managed Object and Connector Type Generation – We've built a parser that can generate TypeScript types from your Managed Object and Connector types, this means that you can use your Managed Object or Connector types directly in TypeScript which enables IDE type-ahead assistance and type safety.
* Integration Testing – Write end-to-end integration tests that work on real connectors, complete with test data clean-up and data generation.  Now you can have even greater levels of confidence with each deployment. 
* Unit Testing (coming soon) – We've put together a unit testing framework that allows you to test your JavaScript/TypeScript code using the Rhino JavaScript engine with some convenient ready-to-use IDM API mocks.

## Dependencies
To get the most out of this seed project you should install the following dependencies

* [Yarn](https://yarnpkg.com) – The yarn package manager like NPM, but better, you could use NPM, but you'll need to modify references to NPM in the `package.json`
* [Visual Studio Code](https://code.visualstudio.com) – Microsoft's Open Source code editor, it has excellent TypeScript support, so it is ideal for this project.
* [VS Code TSLint Plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) – This plugin for Visual Studio Code shows all the linting problems in VS Code as you type, this is very useful.

## Assumptions
This seed project assumes that your Manage Object IDM file `managed.json` and your connector files `provisioner.*.json` are committed in the same repo as your JavaScript code, and that the `idmTsCodeGen.idmProjectConfigDir` property in the `config/default.json` file points to a folder with those files in it.  Otherwise, it cannot be guaranteed that the type checking is actually correct if you version those files separately.

## Common Commands
### Building your JavaScript
There are 2 commands that can be used to generate the TypeScript types and transpile (convert) your TypeScript code into JavaScript.
`yarn build` generates your typescript types and then recompiles the JavaScript once and exits
`yarn watch` generates your typescript types and then watches your typescript files recompiling the JavaScript every time you save.

### Running Integration Tests
`yarn integration-test` runs the Jest integration tests.

## Including external libraries
Lodash is a common external library that is expected to be available at runtime as `lib/lodash`. For this to work you need to specify external libraries in the `webpack.config.ts` under `externals`. If there are TypeScript Types available for the library in question, ie lodash, and you have installed them in your package.json, you'll also need to create a small typescript definition file, see `lib/lodash.d.ts` which simply includes the types from the lodash module.

## Notable Examples

### Using TypeScript with Custom Scripted Policies

It is possible to use TypeScript with [Custom Scripted Policies](https://backstage.forgerock.com/docs/idm/7.2/objects-guide/extending-policies.html#custom-scripted-policies), but it only works well in a certain setup.

The built-in `bin\defaults\script\policy.js` file loads any additional policies defined in `policy.json` under the `additionalFiles: []` property. The first time a policy is evaluated the contents of the additional policy is cached inside the `policy` service until it is reloaded or IDM is restarted.

While it is possible to reload the `policy` service, by modifying it in some way, e.g. adding a dummy property, this is a bit frustrating if you're developing a policy, and you just want the policy to be updated on save. The solution is to have the additional policy JavaScript file an intermediate step and include another JavaScript module (in our case it originates from TypeScript), as this will be executed every time the policy is evaluated.

The main catch to keeping the policy functions in a separate module is that the functions need to be brought in the scope of the intermediate file, otherwise `policy.js` will complain that it can't find the function. This means that every time you create a new policy function you need to "register" the function in the intermediate file, and then cause the `policy` service to reload. But after that any modifications to the policy function will refresh automatically. See [registerAdditionalPolicies.js](project/script/registerAdditionalPolicies.js) for an example of the intermediate policy file.

While all the built-in policies in `policy.js` are primarily self-contained functions, so that they can work in the client as well. If the policy you are writing only needs to execute server-side then you can include functions from other TypeScript files which can be useful to prevent code duplication, especially if you are building a policy to enforce something that was already generated by a script elsewhere.

The example [additionalPolicy.ts](src/additionalPolicy.ts) file also uses some useful helper policy types which ensures that the policy functions return the correct JavaScript objects.

## Known Issues

### Complex fields not supported

When using the IDM wrapper APIs to read specific fields, you can't read specific fields across a relationship boundary, the manager surname for example: `idm.managed.user.read("123", { fields: ["manager/sn"]})`, although this is a valid field to IDM, our TypeScript types do not know how to parse this.

This is also the case for other special fields, such as `*` or `*_ref`.

Instead if you want use that sort of field, you need to use `unCheckedFields` "escape hatch" instead, ie `idm.managed.user.read("123", { unCheckedFields: ["manager/sn"]})`.
This means that it won't know which fields are coming back, so it won't be able to restrict the fields that are available. But it will still know that a managed user object is being returned.

See [field name limitations](https://github.com/agiledigital/idm-ts-types#field-name-limitations) for more information.

## TODO
This project is in its early days, and this is a list of potential features that could be added in the future.
* More documentation for how this project works and how you could use it in your own projects.
* Builder API for writing field names, specifically to support querying relationship fields. This can in theory still be typed and restrict the attributes/fields on the returned managed/system object somehow, as well as supporting magic fields like `*` and `*_ref` in a typed way.
* Convert Integration tests to solely use the typescript types
* Improve webpack support, so that it doesn't inline imports
* Unit tests
    * Fix unit tests so they work with webpack
    * Maybe unit tests written in Typescript.
