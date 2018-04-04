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
        this.getClientIdByAccess = this.getClientIdByAccess.bind(this);
        this.deleteAuthentication = this.deleteAuthentication.bind(this);
    };

    postGrant (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'clientId',
            type: 'string',
            nvalues: ['']
        },
        {
            name: 'grant',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function () {
            let dbInput = {
                grant: req.body.grant,
                clientId: req.body.clientId,
            }
            let result = that.realmController.createAuthentication(dbInput);
            let finalResult = {
                id: result.id,
                clientId: result.clientId,
                grant: result.grant
            };
            return finalResult;
        }, res, req);
    };

    getTokensByGrant (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'grant',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function () {
            let object = that.realmController.getTokensByGrant(req.body.grant);
            object = that.realmController.formatRealmObj(object)[0];
            if (object) {
                let id = object.id
                let expireDate = new Date();
                let hours = expireDate.getHours() + 4;
                expireDate.setHours(hours);
                let dbInput = {
                    expire: expireDate,
                    grant: undefined
                };
                let result = that.realmController.updateByGrant(id, dbInput);
                let finalResult = {
                    accessToken: result.accessToken,
                    expire: expireDate,
                    refreshToken: result.refreshToken
                };
                return finalResult;
            } else {
                return {
                    error: {
                        type: 'GRANT_INVALID',
                        msg: 'grant not valid'
                    }
                };
            }
        }, res, req);
    };

    getTokensByRefresh (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'refreshToken',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function () {
            let object = that.realmController.getTokensByRefresh(req.body.refreshToken);
            object = that.realmController.formatRealmObj(object)[0];
            if (object) {
                let id = object.id
                let expireDate = new Date();
                let hours = expireDate.getHours() + 4;
                expireDate.setHours(hours);
                let dbInput = {
                    expire: expireDate
                };
                let result = that.realmController.updateByRefresh(id, dbInput);
                let finalResult = {
                    accessToken: result.accessToken,
                    expire: expireDate,
                    refreshToken: result.refreshToken
                };
                return finalResult;
            } else {
                return {
                    error: {
                        type: 'REFRESH_TOKEN_INVALID',
                        msg: 'refreshToken not valid'
                    }
                };
            }
        }, res, req);
    };

    getClientIdByAccess (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, [{
            name: 'accessToken',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validBody, function () {
            let currentDate = new Date();
            let result = that.realmController.getClientIdByAccessToken(req.body.accessToken);
            result = that.realmController.formatRealmObj(result)[0];
            if (result !== undefined && currentDate < result.expire) {
                let finalResult = {
                    clientId: result.clientId
                };
                return finalResult;
            } else if (!result) {
                return {
                    error: {
                        type: 'ACCESS_TOKEN_INVALID',
                        msg: 'accessToken is invalid'
                    }
                };
            } else {
                return {
                    error: {
                        type: 'ACCESS_TOKEN_EXPIRED',
                        msg: 'accesstoken is expired. Please refresh!'
                    }
                };
            }
        }, res, req);
    };

    deleteAuthentication (req, res) {
        let validParams = this.requestValidator.validRequestData(req.params, [{
            name: 'accessToken',
            type: 'string',
            nvalues: ['']
        }]);
        let that = this;
        this.handleRequest(validParams, function () {
            let object = that.realmController.getAuthenticationByAccessToken(req.params.accessToken);
            if (object[0]) {
                return that.realmController.deleteAuthentication(object);
            } else {
                return {
                    error: {
                        type: 'ACCESS_TOKEN_INVALID',
                        msg: 'accesstoken not valid'
                    }
                };
            }
        }, res, req);
    };

    // Unit Tests kontrollieren, Wieso wird das Date nicht anerkannt? Stimmt Delete sonst soweit?
}

module.exports = AuthenticationController;
