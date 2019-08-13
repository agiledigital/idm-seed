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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/simple.ts");
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

/***/ "./src/simple.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var idm_1 = __webpack_require__("./lib/idm.ts");
exports.findOrCreateUserRelationship = function (userName) {
    logger.info("Linking to " + userName);
    return { _ref: "managed/managedUser/" + userName };
};
exports.sonartsFailure = function () {
    var test = ["first", "second", "third"];
    var curTest;
    // tslint:disable-next-line: no-conditional-assignment
    while (curTest = test.pop()) {
        logger.info("Current Test Value " + curTest);
    }
};
/**
 * Count the number of users who directly and indirectly report to the given user.
 *
 * @param {string} userId The managed user id to count the number of reports on.
 */
exports.countReports = function (userId) {
    var searchQueue = [];
    // Initialise the search with the given user
    searchQueue.push(userId);
    var reports = 0;
    var curUserId;
    // tslint:disable-next-line: no-conditional-assignment
    while ((curUserId = searchQueue.pop())) {
        var curUser = idm_1.idm.managed.user.read(curUserId, {
            fields: ["_id", "reports"]
        });
        if (curUser && curUser.reports) {
            _.each(curUser.reports, function (reportsUser) {
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


/***/ })

/******/ })));