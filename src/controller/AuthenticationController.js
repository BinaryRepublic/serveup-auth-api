'use strict';

const ParentController = require('./ParentController');
const RealmAuthenticationController = require('../../realm/controller/RealmAuthenticationController');


class AuthenticationController extends ParentController {
    constructor () {
        super();
        this.realmController = new RealmAuthenticationController();
        this.postGrant = this.postGrant.bind(this);
        this.getTokensByGrant = this.getTokensByGrant.bind(this);
        this.getTokensByRefresh = this.getTokensByRefresh.bind(this);
        this.getAccountIdByAccess = this.getAccountIdByAccess.bind(this);
    };

    postGrant (req, res) {
        let properties = ['accountId', 'grant'];
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'accountId',
            type: 'string',
            nvalues: ['']
        },
        {
            name: 'grant',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function() {
            let dbInput = {
                grant: req.body.grant,
                accountId: req.body.accountId,
            }
            let result = that.realmController.createAuthentication(dbInput);
            let finalResult = {
                id: result.id,
                accountId: result.accountId,
                grant: result.grant
            }
            return finalResult
        }, res);
    };

    getTokensByGrant (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'grant',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function() {
            let object = that.realmController.getTokensByGrant(req.body.grant);
            object = that.realmController.formatRealmObj(object)[0]
            if (object) {
                let id = object[0].id
                let expireDate = new Date();
                let hours = expireDate.getHours() + 4;
                expireDate.setHours(hours)
                let dbInput = {
                    expire: expireDate,
                    grant: undefined
                }
                let result = that.realmController.updateByGrant(id, dbInput);
                let finalResult = {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }
                return finalResult
            } else {
                return {
                    error: {
                        type: 'GRANT_INVALID',
                        msg: 'grant not valid'
                    }
                }
            }
         }, res);

    };


    getTokensByRefresh (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'refreshToken',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function() {
            let object = that.realmController.getTokensByRefresh(req.body.refreshToken);
            object = that.realmController.formatRealmObj(object)[0]
            if (object) {
                let id = object[0].id
                let expireDate = new Date();
                let hours = expireDate.getHours() + 4;
                expireDate.setHours(hours)
                let dbInput = {
                    expire: expireDate
                }
                let result = that.realmController.updateByRefresh(id, dbInput);
                let finalResult = {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken
                }
                return finalResult
            } else {
                return {
                    error: {
                        type: 'REFRESH_TOKEN_INVALID',
                        msg: 'refreshToken not valid'
                    }
                }
            }
        },  res);
    };

    getAccountIdByAccess (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'accessToken',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function() {
                let currentDate = new Date();
                let result = that.realmController.getAccountIdByAccessToken(req.body.accessToken);
                result = that.realmController.formatRealmObj(result)[0]
                if (result != undefined && currentDate < result.expire) {
                    let finalResult = {
                        accountId: result[0].accountId
                    }
                    return finalResult
                } else if (!result) {
                    return {
                        error: {
                            type: 'ACCESS_TOKEN_INVALID',
                            msg: 'accessToken is invalid'
                        }
                    }
                } else {
                    return {
                        error: {
                            type: 'ACCESS_TOKEN_EXPIRED',
                            msg: 'accesstoken is expired. Please refresh!'
                        }
                    }
                }
        },  res);
    };   

    // Logout Function: Post accessToken to /logout --> filter by accessToken, delete complete authentication
}

module.exports = AuthenticationController;