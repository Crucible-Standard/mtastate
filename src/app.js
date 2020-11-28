const logger = require('sst').logger;
const format = require('sst').format;

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pkjson = require('../package.json');

const status = require('./models/');

const app = express()

let requestsCount = 0;

// adding helmet to enhance api security
app.use(helmet());

// using bodyParser to parse json bodies into js objects
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/** set up cors middleware
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Origin, X-Requested-With');
  res.header('Access-Control-Allow-Methods', 'GET');
  next();
});

logger.info('turning on app...');

/**
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.get('/health', (req, res, next) => {
  requestsCount++;
  const time = process.uptime();
  const uptime = format.toDDHHMMSS(time + '');
  logger.info(`/health request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip}`);
  res.status(200).send({ data: {uptime: uptime, version: pkjson.version, requests: requestsCount} });
});


/**
 * This will be reserved for slack intigration
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.post('/slack', (req, res, next) => {
  requestsCount++;
  logger.info(`/slack request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip}`);
  status.getSingle(req).then((response) => {
    res.status(200).send({ response_type: 'in_channel', text: response });
  }).catch((error) => {
    res.status(400).send({ response_type: 'in_channel', text: response });
  });
});

/**
 * This will be reserved for slack intigration
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {Next} next - Express Next object
 */
app.get('/', (req, res, next) => {
  requestsCount++;
  logger.info(`/ request from ${req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip}`);

  const errors = status.getSingle(req).then((response) => {
    res.status(200).send({ data: response });
  });
  errors.catch((error) => {
    res.status(200).send({ data: error });
  });
});

// heroku dynamically assigns your app a port, so you can't set the port to a fixed number.
const server = app.listen(process.env.PORT || 5000, function () {
  const host = server.address().address;
  const port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});

module.exports = {server};
