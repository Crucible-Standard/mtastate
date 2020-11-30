const sanitize = require('sst').sanitize;

const Mta = require('mta-gtfs');
const striptags = require('striptags');

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

function getSingle (req) {
  return new Promise(async (resolve, reject) => {
    if (((req.query.line) && req.query.line.length > 0) || ((req.body.text) && req.body.text.length > 0)) {
      const args = req.query.line || req.body.text;
      const mta = new Mta({
        key: 'MY-MTA-API-KEY-HERE', // only needed for mta.schedule() method
        feed_id: 1, // optional, default = 1
      });

      let response = '';

      if (!getLineKey(args)) {
        resolve(`You must specify a valid 'line' as a GET Param.`);
      }
      const lineName = getLineKey(args);
      await mta.status(getServiceKey(lineName)).then((train) => {
        try {
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
        })
        } catch(error) {
          resolve(error);
        };
      });
      resolve(response);

    } else {
      reject(`Please use the endpoint with a get param of 'line'. example https://mtastate.herokuapp.com/?line=123`);
    }
  });

}

module.exports = {getSingle, getColorForLine, getServiceKey, getLineKey};
