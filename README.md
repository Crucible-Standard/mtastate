mtastate
=========

[![codecov](https://codecov.io/gh/wh-iterabb-it/mtastate/branch/master/graph/badge.svg)](https://codecov.io/gh/wh-iterabb-it/mtastate)



### Description:

You should be able to do a GET request against the API and receive back information about any new jersey transit or MTA train line.

example being `GET` to  `https://mtastate.herokuapp.com/?line=1` for the 1 MTA line local information.

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
