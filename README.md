mtastate
=========

[![Issues](https://img.shields.io/github/issues/Crucible-Standard/mtastate.svg)](https://github.com/Crucible-Standard/mtastate/issues)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/Crucible-Standard/mtastate/blob/main/LICENSE)
![Known Vulnerabilities](https://snyk.io/test/github/Crucible-Standard/mtastate/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![codecov](https://codecov.io/gh/Crucible-Standard/mtastate/branch/main/graph/badge.svg)](https://codecov.io/gh/Crucible-Standard/mtastate)


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
