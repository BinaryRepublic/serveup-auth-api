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
        let validBody = this.requestValidator.validRequestData(req.body, properties);
        let that = this;
        this.handleRequest(validBody, function() {
            let dbInput = {
                grant: req.body.grant,
                accountId: req.body.accountId,
            }
            return that.realmController.createAuthentication(dbInput);
        }, res);
    };

    getTokensByGrant (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['grant']);
        let that = this;
        this.handleRequest(validBody, function() {
            let expireDate = new Date();
            let hours = expireDate.getHours() + 4;
            expireDate.setHours(hours)
            let dbInput = {
                expire: expireDate,
                grant: undefined
            }
            let result = that.realmController.getTokensByGrant(req.body.grant, dbInput);
            let finalResult = {
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                expire: result.expire
            }
            return finalResult
         }, res);
    };

    getTokensByRefresh (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['refreshToken']);
        let that = this;
        this.handleRequest(validBody, function() {
                let expireDate = new Date();
                let hours = expireDate.getHours() + 4;
                expireDate.setHours(hours)
                let dbInput = {
                    expire: expireDate
                }
                let result = that.realmController.getTokensByRefresh(req.body.refreshToken, dbInput);
                let finalResult = {
                    accessToken: result.accessToken,
                    refreshToken: result.refreshToken,
                    expire: result.expire
                }
                return finalResult
            },  res);
    };

    getAccountIdByAccess (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['accessToken']);
        let that = this;
        this.handleRequest(validBody, function() {
                let currentDate = new Date();
                let result = that.realmController.getAccountIdByAccessToken(req.body.accessToken);
                if (currentDate < result[0].expire) {
                    let finalResult = {
                        accountId: result[0].accountId
                    }
                    return finalResult
                } else {
                    return ("invalid accessToken")
                }
            },  res);
    };   
}

module.exports = AuthenticationController;