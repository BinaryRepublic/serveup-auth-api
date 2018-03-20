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
        return this.objectsWithFilter(this.className, 'grant == "' + grant + '"');
    };
    
    updateByGrant (id, authenticationJSON) {
        authenticationJSON.accessToken = uuidv4();
        authenticationJSON.refreshToken = uuidv4();
        return this.updateObject(this.className, id, authenticationJSON, []);
    };
             
    getTokensByRefresh (refreshToken, authenticationJSON) {
        return this.objectsWithFilter(this.className, 'refreshToken == "' + refreshToken + '"');
    };

    updateByRefresh (id, authenticationJSON) {
        authenticationJSON.accessToken = uuidv4();
        return this.updateObject(this.className, id, authenticationJSON, []);
    };

    getClientIdByAccessToken (accessToken) {
        return this.objectsWithFilter(this.className, 'accessToken == "' + accessToken + '"')
    };
}

module.exports = RealmAuthenticationController;
