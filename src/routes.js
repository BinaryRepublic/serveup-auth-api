'use strict';

const Router = require('express').Router();
const AuthenticationController = require('./controller/AuthenticationController');

// Authentication
let authenticationController = new AuthenticationController();
Router.post('/grant', authenticationController.postGrant);
Router.post('/access/grant', authenticationController.getTokens);
Router.post('/access/refresh', authenticationController.postRefreshToken);
Router.post('/access', authenticationController.getAccountId);

module.exports = Router;




