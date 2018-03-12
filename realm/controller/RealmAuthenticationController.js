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
        // var expireDate = new Date();
        // console.log(expireDate);
        // let hours = expireDate.getHours() + 4;
        // console.log(hours)
        // expireDate.setHours(hours)
        // console.log(expireDate)
        // authenticationJSON.expire = expireDate;
        authenticationJSON.grant = 'null';
        let result = this.updateObject(this.className, grant, authenticationJSON, []);
        let finalResult = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }
        return finalResult
    };

    getAccessToken (refreshToken, authenticationJSON) {
        authenticationJSON.accessToken = uuidv4();
        // var expireDate = new Date();
        // let hours = expireDate.getHours() + 4;
        // expireDate.setHours(hours)
        // authenticationJSON.expire = expireDate;
        // console.log(authenticationJSON)
        let result = this.updateObject2(this.className, refreshToken, authenticationJSON, []);
        let finalResult = {
            accessToken: result.accessToken,
            refreshToken: result.refreshToken
        }
        return finalResult
    };

    getAccountIdByAccessToken (accessToken) {
        let result = this.objectWithAccess(this.className, accessToken)
        let currentDate = new Date();
        if (currentDate < result.expireDate) {
            let finalResult = {
                accountId: result.accountId
            }
            return finalResult
        } else {
            return ("invalid accessToken")
        }
    }
}

module.exports = RealmAuthenticationController;





