'use strict';

const RequestValidator = require('./RequestValidator'); 
const ParentRealmController = require('../../realm/ParentRealmController');

class ParentController {
    constructor () {
        this.requestValidator = new RequestValidator();
        this.realmController = new ParentRealmController();
    };
    handleRequest (requestValidError, databaseCallback, res) {
        if (requestValidError === false) {
            let result = databaseCallback();
            result = this.realmController.formatRealmObj(result);
            this.handleResponse(res, result);
        } else {
            let badRequest = {
                error: requestValidError
            };
            res.status(400).json(badRequest);
        }
    };
    handleResponse (res, jsonObject) {
        if (jsonObject) {
            if (jsonObject.error === undefined) {
                res.json(jsonObject);
            } else {
                res.status(500).json(jsonObject);
            }
        } else {
            res.sendStatus(500);
        }
    };
}
module.exports = ParentController;