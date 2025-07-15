const express = require('express');
const app = express();
require('dotenv').config();
const bodyParser = require('body-parser');
const eventRoutes = require('./routes/eventRoutes');

app.use(bodyParser.json());
app.use('/api', eventRoutes);

module.exports = app;
