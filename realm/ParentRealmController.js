'use strict';

const Realm = require('realm');
const Authentication = require('./models/Authentication.js');

class ParentRealmController {
    constructor () {
        this.Authentication = Authentication;

        var that = this;
        this.realm = Realm.open({
            path: './DataRealm/default.realm',
            schema: [Authentication]
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
    objectWithId (className, id) {
        let object = this.realm.objects(className).filtered('id = $0', id);
        if (object && object.length === 1) {
            return object[0];
        }
    };

    objectsWithFilter (className, filter) {
        filter = '(' + filter + ')';
        let result = this.realm.objects(className).filtered(filter);
        return result
    };

    createObject (className, objData) {
        return this.writeObject(className, objData, false);
    };

    updateObject (className, objectId, objData, legalAttributes) {
        for (var property in objData) {
            if (objData.hasOwnProperty(property) && legalAttributes !== true) {
                if (!legalAttributes.includes(property)) {
                    delete objData.property;
                }
            }
        }
        let updateObj = this.objectWithId(className, objectId);
        if (updateObj) {
            objData.id = objectId;
            return this.writeObject(className, objData, true);
        }
    };

    // Realm Methods 
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

