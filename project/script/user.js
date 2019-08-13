(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/user.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/idm.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
// Generated file
var idm_ts_1 = __webpack_require__("./node_modules/@agiledigital/idm-ts-types/lib/idm-ts.ts");
exports.idm = __assign({}, openidm, { managed: {
        SubTypeTest: idm_ts_1.idmObject("managed/SubTypeTest"),
        assignment: idm_ts_1.idmObject("managed/assignment"),
        pendingRelationships: idm_ts_1.idmObject("managed/pendingRelationships"),
        role: idm_ts_1.idmObject("managed/role"),
        user: idm_ts_1.idmObject("managed/user")
    }, system: {
        scimAccount: idm_ts_1.idmObject("system/scim/account"),
        scimGroup: idm_ts_1.idmObject("system/scim/group"),
        usersWithManagersAccount: idm_ts_1.idmObject("system/UsersWithManagers/__ACCOUNT__")
    } });
exports["default"] = exports.idm;


/***/ }),

/***/ "./node_modules/@agiledigital/idm-ts-types/lib/idm-ts.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var IDMObject = /** @class */ (function () {
    function IDMObject(type) {
        this.type = type;
    }
    IDMObject.prototype.read = function (id, _a) {
        var _b = _a === void 0 ? {} : _a, params = _b.params, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm.read(this.type + "/" + id, params, unCheckedFields ? unCheckedFields : fields);
    };
    IDMObject.prototype.create = function (newResourceId, content, _a) {
        var _b = _a === void 0 ? {} : _a, params = _b.params, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm.create(this.type, newResourceId, content, params, unCheckedFields ? unCheckedFields : fields);
    };
    IDMObject.prototype.patch = function (id, rev, value, _a) {
        var _b = _a === void 0 ? {} : _a, params = _b.params, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm.patch(this.type + "/" + id, rev, value, params, unCheckedFields ? unCheckedFields : fields);
    };
    IDMObject.prototype.update = function (id, rev, value, _a) {
        var _b = _a === void 0 ? {} : _a, params = _b.params, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm.update(this.type + "/" + id, rev, value, params, unCheckedFields ? unCheckedFields : fields);
    };
    IDMObject.prototype["delete"] = function (id, rev, _a) {
        var _b = _a === void 0 ? {} : _a, params = _b.params, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm["delete"](this.type + "/" + id, rev, params, unCheckedFields ? unCheckedFields : fields);
    };
    IDMObject.prototype.query = function (params, _a) {
        var _b = _a === void 0 ? {} : _a, fields = _b.fields, unCheckedFields = _b.unCheckedFields;
        return openidm.query(this.type, params, unCheckedFields ? unCheckedFields : fields);
    };
    /**
     * Create a relationship object for the given managed object and id.
     *
     * @param managedObjectId The managed object id to link to
     */
    IDMObject.prototype.relationship = function (managedObjectId) {
        return {
            _ref: this.type + "/" + managedObjectId
        };
    };
    return IDMObject;
}());
exports.IDMObject = IDMObject;
exports.idmObject = function (type) { return new IDMObject(type); };


/***/ }),

/***/ "./src/user.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var idm_1 = __webpack_require__("./lib/idm.ts");
var lodash_1 = __importDefault(__webpack_require__("lib/lodash"));
exports.asyncLinkManager = function (managedUser) {
    // Find out if there are any pending relationships
    var params = {
        _queryFilter: "targetCollection eq '" + idm_1.idm.managed.user.type + "' and targetUniqueKey eq '" + managedUser.userName + "' and !(actionTime pr)"
    };
    var pending = idm_1.idm.managed.pendingRelationships.query(params);
    lodash_1["default"](pending.result).forEach(function (pendingRel) {
        // Use the specified filter if it exists, otherwise assume the uniqueKey is the _id
        var query = pendingRel.sourceQueryFilter ? pendingRel.sourceQueryFilter : "_id eq '" + pendingRel.sourceUniqueKey + "'";
        var results = openidm.query(pendingRel.sourceCollection, { _queryFilter: query }, ["_id"]);
        if (results.result.length > 1 || results.result.length === 0) {
            logger.error("Expecting to find 1 result for pending relationship {}, but got {}", pendingRel, results.result.length);
        }
        else {
            var sourceId = results.result[0]._id;
            var patch = [
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
            var resourceName = pendingRel.sourceCollection + "/" + sourceId;
            // logger.info("Attempting to patch {} with {}", resourceName, JSON.stringify(patch,null,2))
            openidm.patch(resourceName, null, patch);
            // If patch is successful then we can delete the pending relationship
            logger.info("About to mark the pending relationship as actioned {} because user {} found it.", pendingRel, managedUser._id);
            //   idm.managed.pendingRelationships.delete(pendingRel._id, null);
            idm_1.idm.managed.pendingRelationships.patch(pendingRel._id, pendingRel._rev, [
                {
                    field: "actionTime",
                    operation: "replace",
                    value: new Date().toISOString()
                }
            ]);
        }
    });
};
exports.linkManager = function (source, target) {
    if (source.Manager) {
        var managerObj = idm_1.idm.managed.user.read(source.Manager, {
            fields: ["_id"]
        });
        logger.info("Looking for manager {} found? {}", source.Manager, managerObj !== null);
        if (managerObj) {
            // The manager exists already, lets link straight away
            target.manager = idm_1.idm.managed.user.relationship(source.Manager);
            target.safeToSync = true;
            // Delete any pending relationships, incase they are sitting around, but it could be a different manager,
            // so leave out the unique key
            var oldPendingRelationships = idm_1.idm.managed.pendingRelationships.query({
                _queryFilter: "targetCollection eq '" + idm_1.idm.managed.user.type + "' and sourceCollection eq '" + idm_1.idm.managed.user.type + "' and sourceRelationshipProperty eq 'manager' and sourceUniqueKey eq '" + target.userName + "'"
            }, {
                fields: ["_id"]
            });
            lodash_1["default"].chain(oldPendingRelationships.result)
                .pluck("_id")
                .map(function (id) { return idm_1.idm.managed.pendingRelationships["delete"](id, null); });
        }
        else {
            // The manager doesn't exist yet, so we will link it up later
            idm_1.idm.managed.pendingRelationships.create(null, {
                creationTime: new Date().toISOString(),
                sourceCollection: idm_1.idm.managed.user.type,
                sourceRelationshipProperty: "manager",
                sourceUniqueKey: target.userName,
                targetCollection: idm_1.idm.managed.user.type,
                targetUniqueKey: source.Manager
            });
        }
    }
    else {
        // There is no manager so lets mark the user as safe to sync
        target.safeToSync = true;
    }
};


/***/ }),

/***/ "lib/lodash":
/***/ (function(module, exports) {

module.exports = require("lib/lodash");

/***/ })

/******/ })));