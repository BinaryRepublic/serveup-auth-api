'use strict';

const Router = require('express').Router();
const AuthenticationController = require('./controller/AuthenticationController');

// Authentication
let authenticationController = new AuthenticationController();
Router.post('/grant', authenticationController.postGrant);
Router.post('/access/grant', authenticationController.getTokensByGrant);
Router.post('/access/refresh', authenticationController.getTokensByRefresh);
Router.post('/access', authenticationController.getClientIdByAccess);
Router.delete('/logout/:accessToken', authenticationController.deleteAuthentication);


module.exports = Router;
