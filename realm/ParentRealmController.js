'use strict';

const Realm = require('realm');
const Authentication = require('./models/Authentication.js');

class ParentRealmController {
    constructor () {
        this.Authentication = Authentication;

        var that = this;
        this.realm = Realm.open({
            schema: [Authentication],
            schemaVersion: 1
        }).then(realm => {
            that.realm = realm;
        })
    };

    // transforms Object in Array
    formatRealmObj (objectElem, emptyToUndefined = false, deleteRealmFlags = true) {
        let result = null;
        let worker = objectElem;
        if (typeof worker === 'object' && !(worker instanceof Date) && !Array.isArray(worker)) {
            let toArray = false;
            for (let key in worker) {
                if (key === '0') {
                    toArray = true;
                    break;
                }
            }
            if (toArray) {
                result = [];
                worker = Array.from(worker);
                for (let x = 0; x < worker.length; x++) {
                    result[x] = this.formatRealmObj(worker[x], emptyToUndefined, deleteRealmFlags);
                }
            } else if (JSON.stringify(worker) === JSON.stringify({})) {
                if (!emptyToUndefined) {
                    result = [];
                } else {
                    result = undefined;
                }
            } else if (worker === null) {
                if (emptyToUndefined) {
                    result = undefined;
                }
            } else {
                result = {};
                for (let key in worker) {
                    // remove realm flags
                    if ((key !== 'deleted' && key !== 'created') || !deleteRealmFlags) {
                        let newObj = this.formatRealmObj(worker[key], emptyToUndefined, deleteRealmFlags);
                        if (newObj !== undefined) {
                            result[key] = newObj;
                        } else {
                            delete result[key];
                        }
                    }
                }
            }
        } else {
            if (Array.isArray(objectElem) && !objectElem.length && emptyToUndefined) {
                result = undefined;
            } else if (Array.isArray(worker)) {
                result = [];
                worker.forEach((workerItem, x) => {
                    result[x] = this.formatRealmObj(workerItem, emptyToUndefined, deleteRealmFlags);
                });
            } else {
                result = objectElem;
            }
        }
        return result;
    };

    // Abstract methods

    objectsWithFilter (className, filter) {
        filter = '(' + filter + ') && deleted == null';
        return this.realm.objects(className).filtered(filter);
    };

    objectWithGrant (className, grant) {
        let object = this.realm.objects(className).filtered('grant = $0', grant);
        if (object && object.length === 1) {
            return object[0];
        }
    };

    objectWithRefresh (className, refreshToken) {
        let object = this.realm.objects(className).filtered('refreshToken = $0', refreshToken);
        if (object && object.length === 1) {
            return object[0];
        }
    };

    objectWithAccess (className, accessToken) {
        let object = this.realm.objects(className).filtered('accessToken = $0', accessToken);
        if (object && object.length === 1) {
            return object[0];
        }
    };

    createObject (className, objData) {
        return this.writeObject(className, objData, false);
    };
    
    updateObject (className, objectGrant, objData, legalAttributes) {
        for (var property in objData) {
            if (objData.hasOwnProperty(property) && legalAttributes !== true) {
                if (!legalAttributes.includes(property)) {
                    delete objData.property;
                }
            }
        }
        let updateObj = this.objectWithGrant(className, objectGrant);
        if (updateObj) {
            objData.id = updateObj.id;
            objData.accountId = updateObj.accountId;
            return this.writeObject(className, objData, true);
        }
    };

    updateObject2 (className, objectRefreshToken, objData, legalAttributes) {
        for (var property in objData) {
            if (objData.hasOwnProperty(property) && legalAttributes !== true) {
                if (!legalAttributes.includes(property)) {
                    delete objData.property;
                }
            }
        }
        let updateObj = this.objectWithRefresh(className, objectRefreshToken);
        console.log(updateObj)
        if (updateObj) {
            objData.id = updateObj.id;
            objData.accountId = updateObj.accountId;
            objData.grant = updateObj.grant
            return this.writeObject(className, objData, true);
        }
    };

    writeObject (className, obj, update) {
        let created;
        try {
            this.realm.write(() => {
                created = this.realm.create(className, obj, update);
            });
        } catch (e) {
            if (process.env.DEBUG) {
                console.log('Error on creation: ' + e);
                console.log(className + ' -> ' + JSON.stringify(obj));
            }
        }
        return created;
    };
}

module.exports = ParentRealmController;

