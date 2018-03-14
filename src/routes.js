'use strict';

const Router = require('express').Router();
const AuthenticationController = require('./controller/AuthenticationController');

// Authentication
let authenticationController = new AuthenticationController();
Router.post('/grant', authenticationController.postGrant);
Router.post('/access/grant', authenticationController.getTokensByGrant);
Router.post('/access/refresh', authenticationController.getTokensByRefresh);
Router.post('/access', authenticationController.getAccountIdByAccess);

module.exports = Router;




