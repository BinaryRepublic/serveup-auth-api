'use strict';

const expect = require('chai').expect;
const request = require('supertest');
const uuidv4 = require('uuid/v4');

// const Helper = require('./helper/helper');

// require controllers
const AuthenticationController = require('../src/controller/AuthenticationController');

let refreshToken;
let accessToken;
let accessToken2;
let grant = uuidv4();
let accountId = uuidv4();

describe('loading express', function () {
    let server;
    beforeEach(function () {
        server = require('../app');
    });
    afterEach(function () {
        server.close();
    });
    describe('ORDER-VALID', () => {
        const authentication = new AuthenticationController();
        it('check authentication methods', () => {
            expect(authentication.postGrant).to.be.a('Function');
            expect(authentication.getTokensByGrant).to.be.a('Function');
            expect(authentication.getTokensByRefresh).to.be.a('Function');
            expect(authentication.getAccountIdByAccess).to.be.a('Function');
        });
        it('POST /grant', (done) => {
            let data = {
                grant: grant,
                accountId: accountId
            };
            request(server)
                .post('/grant')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, response) {
                    if (err) return done(err);
                    
                    let authentication = response.body;
                    expect(authentication.id).to.be.a('string');
                    expect(authentication.accountId).to.be.a('string');
                    expect(authentication.grant).to.be.a('string');
                    done();
                });
        });
        it('POST /access/grant', (done) => {
            let data = {
                grant: grant
            };
            request(server)
                .post('/access/grant')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, response) {
                    if (err) return done(err);

                    let authentication = response.body;
                    expect(authentication.accessToken).to.be.a('string');
                    expect(authentication.refreshToken).to.be.a('string');
                    refreshToken = authentication.refreshToken;
                    accessToken = authentication.accessToken;
                    done();
                });
        });
        it('POST /access/refresh', (done) => {
            let data = {
                refreshToken: refreshToken
            };
            request(server)
                .post('/access/refresh')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, response) {
                    if (err) return done(err);

                    let authentication = response.body;
                    expect(authentication.accessToken).to.be.a('string');
                    expect(authentication.refreshToken).to.be.a('string');
                    accessToken2 = authentication.accessToken;
                    done();
                });
        });
        it('POST /access', (done) => {
            let data = {
                accessToken: accessToken2
            };
            request(server)
                .post('/access')
                .send(data)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, response) {
                    if (err) return done(err);

                    let authentication = response.body;
                    expect(authentication.accountId).to.be.a('string');
                    done();
                });
        });
    });
});
