'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use('/', require('./src/middleware/accessControl').main);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./src/routes'));

module.exports = app.listen(4000);
