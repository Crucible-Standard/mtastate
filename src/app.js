const logger = require('server-side-tools').logger;
const format = require('server-side-tools').format;
const sanitize = require('server-side-tools').sanitize;

const Mta = require('mta-gtfs');
const striptags = require('striptags');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const pkjson = require('../package.json');

const app = express()

// adding helmet to enhance api security
app.use(helmet());

// using bodyParser to parse json bodies into js objects
app.use(bodyParser.json());

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
 * getLineKey
 * @param {string} input - expected to be a single character for a MTA transit line
 */
function getLineKey(input) {
  switch (input.toUpperCase()) {
    // MTA
    case '1':
    case '2':
    case '3':
      return '123';
    case '4':
    case '5':
    case '6':
      return '456';
    case '7':
      return '7';
    case 'A':
    case 'C':
    case 'E':
      return 'ACE';
    case 'B':
    case 'D':
    case 'F':
    case 'M':
      return 'BDFM';
    case 'G':
      return 'G';
    case 'J':
    case 'Z':
      return 'JZ';
    case 'L':
      return 'L';
    case 'N':
    case 'Q':
    case 'R':
      return 'NQR';
    case 'S':
      return 'S';
    case 'SIR':
      return 'SIR';
    // LIRR
    case 'BABYLON':
      return 'Babylon';
    case 'CITY TERMINAL ZONE':
      return 'City Terminal Zone';
    case 'FAR ROCKAWAY':
      return 'Far Rockaway';
    case 'HEMPSTEAD':
      return 'Hempstead';
    case 'LONG BEACH':
      return 'Long Beach';
    case 'MONTAUK':
      return 'Montauk';
    case 'OYSTER BAY':
      return 'Oyster Bay';
    case 'PORT JEFFERSON':
      return 'Port Jefferson';
    case 'PORT WASHINGTON':
      return 'Port Washington';
    case 'RONKONKOMA':
      return 'Ronkonkoma';
    case 'WEST HEMPSTEAD':
      return 'West Hempstead';
    // MetroNorth
    case 'HUDSON':
      return 'Hudson';
    case 'HARLEM':
      return 'Harlem';
    case 'WASSAIC':
      return 'Wassaic';
    case 'NEW HAVEN':
      return 'New Haven';
    case 'NEW CANAAN':
      return 'New Canaan';
    case 'DANBURY':
      return 'Danbury';
    case 'WATERBURY':
      return 'Waterbury';
    case 'PASCACK VALLEY':
      return 'Pascack Valley';
    case 'PORT JERVIS':
      return 'Port Jervis';
      // BT - Bridges And Tunnels
    case 'BRONX-WHITESTONE':
      return 'Bronx-Whitestone';
    case 'CROSS BAY':
      return 'Cross Bay';
    case 'HENRY HUDSON':
      return 'Henry Hudson';
    case 'HUGH L. CAREY':
      return 'Hugh L. Carey';
    case 'MARINE PARKWAY':
      return 'Marine Parkway';
    case 'QUEENS MIDTOWN':
      return 'Queens Midtown';
    case 'ROBERT F. KENNEDY':
      return 'Robert F. Kennedy';
    case 'THROGS NECK':
      return 'Throgs Neck';
    case 'VERRAZANO-NARROWS':
      return 'Verrazano-Narrows';
    default:
      return null;
  }
}

/**
 * getServiceKey
 * @param {string} input -
 */
function getServiceKey(input) {
  switch (input) {
    // MTA
    case '123':
    case '456':
    case '7':
    case 'ACE':
    case 'BDFM':
    case 'G':
    case 'JZ':
    case 'L':
    case 'NQR':
    case 'S':
    case 'SIR':
      return 'subway';
    // LIRR
    case 'Babylon':
    case 'City Terminal Zone':
    case 'Far Rockaway':
    case 'Hempstead':
    case 'Long Beach':
    case 'Montauk':
    case 'Oyster Bay':
    case 'Port Jefferson':
    case 'Port Washington':
    case 'Ronkonkoma':
    case 'West Hempstead':
      return 'LIRR';
    // MetroNorth
    case 'Hudson':
    case 'Harlem':
    case 'Wassaic':
    case 'New Haven':
    case 'New Canaan':
    case 'Danbury':
    case 'Waterbury':
    case 'Pascack Valley':
    case 'Port Jervis':
      return 'MetroNorth';
    // BT - Bridges And Tunnels
    case 'Bronx-Whitestone':
    case 'Cross Bay':
    case 'Henry Hudson':
    case 'Hugh L. Carey':
    case 'Marine Parkway':
    case 'Queens Midtown':
    case 'Robert F. Kennedy':
    case 'Throgs Neck':
    case 'Verrazano-Narrows':
      return 'BT';
    // Bus
    case 'B1 - B84':
    case 'B100 - B103':
    case 'BM1 - BM5':
    case 'BX1 - BX55':
    case 'BXM1 - BXM18':
    case 'M1 - M116':
    case 'Q1 - Q113':
    case 'QM1 - QM44':
    case 'S40 - S98':
    case 'x1 - x68':
      return 'bus';
  }
}

/**
 * getColorForLine
 * @param {string} input - returns the color for the line, this is normally used for IRC coloring
 */
function getColorForLine(line) {
  const lineColors = {
    '123': 'light_red',
    '456': 'dark_green',
    '7': 'magenta',
    'ACE': 'dark_blue',
    'BDFM': 'orange',
    'G': 'light_green',
    'JZ': 'dark_red',
    'NQR': 'yellow',
    'L': 'gray',
    'S': 'gray',
    'SIR': 'dark_blue',
  };
  if (typeof lineColors[line] !== 'undefined') {
    return lineColors[line];
  }
  return null;
}

  /**
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Next} next - Express Next object
   */
  app.get('/:id', async (req, res, next) => {
    const args = req.params.id;
    const mta = new Mta({
      key: 'MY-MTA-API-KEY-HERE', // only needed for mta.schedule() method
      feed_id: 1, // optional, default = 1
    });

    let response = '';

    if (!getLineKey(args)) {
      return Promise.resolve('You must specify a valid line!');
    }
    const lineName = getLineKey(args);
    await mta.status(getServiceKey(lineName)).then((train) => {
      train.map((currentLine) => {
        if (currentLine.name === lineName) {
          let outStatus = sanitize(currentLine.name) + ': ' +
            sanitize(striptags(currentLine.status));
          let outText = sanitize(striptags(currentLine.text));
          if (outText.length > 0) {
            outStatus = outStatus + outText.replace(/\s+/g, ' ');
          }
          response = outStatus;
        }
      });
    });
    res.status(200).send({ data: response});
  });

  /**
   * @param {Request} req - Express request object
   * @param {Response} res - Express response object
   * @param {Next} next - Express Next object
   */
  app.get('/health', (req, res, next) => {
    const time = process.uptime();
    const uptime = format.toDDHHMMSS(time + '');
    res.status(200).send({ data: {uptime: uptime, version: pkjson.version} });
  });

  // heroku dynamically assigns your app a port, so you can't set the port to a fixed number.
  var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http://%s:%s', host, port);
  });

  module.exports = server;
