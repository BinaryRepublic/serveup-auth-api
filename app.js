'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const metricsMiddleware = promBundle({
    includeStatusCode: true,
    includeMethod: true,
    includePath: true
});
app.use(metricsMiddleware);
app.use('/', require('./src/middleware/accessControl').main);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', require('./src/routes'));
module.exports = app.listen(4000, () => console.log('Auth API running on port 4000'));
