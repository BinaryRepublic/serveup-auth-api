'use strict';

const uuidv4 = require('uuid/v4');
const ParentRealmController = require('../ParentRealmController');

class RealmAuthenticationController extends ParentRealmController {
    constructor () {
        super();
        this.className = 'Authentication';
    }

    createAuthentication (authenticationJSON) {
        authenticationJSON.id = uuidv4();
        return this.createObject(this.className, authenticationJSON);
    };

    getTokensByGrant (grant, authenticationJSON) {
        authenticationJSON.accessToken = uuidv4();
        authenticationJSON.refreshToken = uuidv4();
        //console.log("8")
        //console.log(authenticationJSON)
        //console.log(grant)
        let object = this.objectsWithFilter(this.className, 'grant == "' + grant + '"')
        //console.log("9")
        //console.log(object)
        let id = object[0].id
        // console.log(id)
        return this.updateObject(this.className, id, authenticationJSON, []);
        };
             
    getTokensByRefresh (refreshToken, authenticationJSON) {
        authenticationJSON.accessToken = uuidv4();
        let object = this.objectsWithFilter(this.className, 'refreshToken == "' + refreshToken + '"')
        let id = object[0].id
        return this.updateObject(this.className, id, authenticationJSON, []);
    };

    getAccountIdByAccessToken (accessToken) {
        return this.objectsWithFilter(this.className, 'accessToken == "' + accessToken + '"')
    }
}

module.exports = RealmAuthenticationController;





