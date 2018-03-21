'use strict';

const expect = require('chai').expect;
const request = require('supertest');

const invalid = require('./mockData/authenticationController/invalid');

describe('loading express', function () {
    let server;
    beforeEach(function () {
        server = require('../app');
    });
    afterEach(function () {
        server.close();
    });
    describe('Authentication-INVALID', () => {
        it('POST /grant emptyValues', (done) => {
            request(server)
                .post('/grant')
                .send(invalid.postGrant.emptyValues.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_VALUE');
                    done();
                });
        });
        it('POST /grant missingGrant', (done) => {
            request(server)
                .post('/grant')
                .send(invalid.postGrant.missingGrant.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_MISSING');
                    done();
                });
        });
        it('POST /grant missingClientId', (done) => {
            request(server)
                .post('/grant')
                .send(invalid.postGrant.missingClientId.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_MISSING');
                    done();
                });
        });
        it('POST /access/grant invalidGrant', (done) => {
            request(server)
                .post('/access/grant')
                .send(invalid.getTokensByGrant.invalidGrant.body)
                .set('Accept', 'application/json')
                .expect(500)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('GRANT_INVALID');
                    done();
                });
        });
        it('POST /access/grant emptyGrant', (done) => {
            request(server)
                .post('/access/grant')
                .send(invalid.getTokensByGrant.emptyGrant.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_VALUE');
                    done();
                });
        });
        it('POST /access/grant missingGrant', (done) => {
            request(server)
                .post('/access/grant')
                .send(invalid.getTokensByGrant.missingGrant.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_MISSING');
                    done();
                });
        });
        it('POST /access/refresh invalidRefresh', (done) => {
            request(server)
                .post('/access/refresh')
                .send(invalid.getTokensByRefresh.invalidRefresh.body)
                .set('Accept', 'application/json')
                .expect(500)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('REFRESH_TOKEN_INVALID');
                    done();
                });
        });
        it('POST /access/refresh emptyRefresh', (done) => {
            request(server)
                .post('/access/refresh')
                .send(invalid.getTokensByRefresh.emptyRefresh.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_VALUE');
                    done();
                });
        });
        it('POST /access/refresh missingRefresh', (done) => {
            request(server)
                .post('/access/refresh')
                .send(invalid.getTokensByRefresh.missingRefresh.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_MISSING');
                    done();
                });
        });
        it('POST /access invalidAccess', (done) => {
            request(server)
                .post('/access')
                .send(invalid.getClientIdByAccess.invalidAccess.body)
                .set('Accept', 'application/json')
                .expect(500)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('ACCESS_TOKEN_INVALID');
                    done();
                });
        });
        it('POST /access emptyAccess', (done) => {
            request(server)
                .post('/access')
                .send(invalid.getClientIdByAccess.emptyAccess.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_VALUE');
                    done();
                });
        });
        it('POST /access missingAccess', (done) => {
            request(server)
                .post('/access')
                .send(invalid.getClientIdByAccess.missingAccess.body)
                .set('Accept', 'application/json')
                .expect(400)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('PARAM_MISSING');
                    done();
                });
        });
        it('POST /access expiredAccess', (done) => {
            request(server)
                .post('/access')
                .send(invalid.getClientIdByAccess.expiredAccess.body)
                .set('Accept', 'application/json')
                .expect(500)
                .end(function (err, response) {
                    if (err) return done(err);
                    expect(response.body.error.type).to.equal('ACCESS_TOKEN_EXPIRED');
                    done();
                });
        });
    });
});
