'use strict';

const ParentController = require('./ParentController');
const RealmAuthenticationController = require('../../realm/controller/RealmAuthenticationController');


class AuthenticationController extends ParentController {
    constructor () {
        super();
        this.realmController = new RealmAuthenticationController();
        this.postGrant = this.postGrant.bind(this);
        this.getTokens = this.getTokens.bind(this);
        this.postRefreshToken = this.postRefreshToken.bind(this);
        this.getAccountId = this.getAccountId.bind(this);
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

    getTokens (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['grant']);
        let that = this;
        this.handleRequest(validBody, function() {
            let dbInput = {
            }
            return that.realmController.getTokensByGrant(req.body.grant, dbInput);
         }, res);
    };

    postRefreshToken (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['refreshToken']);
        let that = this;
        this.handleRequest(validBody, function() {
            let dbInput = {
            }
            return that.realmController.getAccessToken(req.body.refreshToken, dbInput);
         }, res);
    };

    getAccountId (req, res) {
        let validBody = this.requestValidator.validRequestData(req.body, ['accessToken']);
        let that = this;
        this.handleRequest(validBody, function() {
            return that.realmController.getAccountIdByAccessToken(req.body.accessToken);
         }, res);
    };
}

module.exports = AuthenticationController;