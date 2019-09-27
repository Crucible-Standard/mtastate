mtastate
=========

[![Greenkeeper badge](https://badges.greenkeeper.io/wh-iterabb-it/mtastate.svg)](https://greenkeeper.io/)
[![Travis Badge](https://travis-ci.org/wh-iterabb-it/mtastate.svg?branch=master)](https://travis-ci.org/wh-iterabb-it/mtastate)
[![Dependency Status](https://img.shields.io/david/wh-iterabb-it/mtastate.svg?style=flat)](https://david-dm.org/wh-iterabb-it/mtastate#info=Dependencies)
[![devDependency Status](https://img.shields.io/david/dev/wh-iterabb-it/mtastate.svg?style=flat)](https://david-dm.org/wh-iterabb-it/mtastate#info=devDependencies)
[![codecov](https://codecov.io/gh/wh-iterabb-it/mtastate/branch/master/graph/badge.svg)](https://codecov.io/gh/wh-iterabb-it/mtastate)
![Heroku](https://heroku-badge.herokuapp.com/?app=mtastate)


### Description:

You should be able to do a GET request against the API and receive back information about any new jersey transit or MTA train line.

example being `GET` to  `https://mtastate.herokuapp.com/1` for the 1 MTA line local information.

Example Response:
Status: `200`
```
{
  "data":"123: GOOD SERVICE"
}
```

### Installation

```
npm install
```
### Example Usage

Basic usage
```
npm run start
```

now you should be able to get a response from

```
http://localhost:5000/health
```
