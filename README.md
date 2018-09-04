# micro-auth0

Helper to get user using Auth0

## Install
```
npm install --save @orikami/micro-auth0
```

## Configure Auth0

By default, micro-auth0 is configured to use RS256 with the orikami.eu.auth0.com public key. It will not check for any roles by default.

You can customize and verify the configuration as follows:

1. Create a SPA application in Auth0: https://manage.auth0.com/#/applications
2. Settings > Advanced > OAuth > JsonWebToken Signature Algorithm: `RS256`
3. Settings > Certificates > Signing Certificate contains the `publickey`.

If you want to customize configuration, create a [auth0.js](./auth0.js) in your project:
```js
module.exports = {
    publickey: `...` // default: orikami.eu.auth0.com
    roles: {
      key: "https://orikami-api.nl/roles",
        // allowed: ['developer'],
    },
    jwt: {
        algorithms: ["RS256"],
        // audience: "https://orikami-api.nl/v1/",
        // ignoreExpiration: false
        // issuer: "",
        // subject: "",
        // maxAge: "",
        // clockTolerance: 10
    }
}
```

If you define `roles.allowed`, micro-auth0 will check if the role in the token. Currently, this is configured using the Authorization extension of Auth0. 

See https://orikami.eu8.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/admins/login

## Usage
```
const auth0 = require("@orikami/micro-auth0")(require("./auth0.js"));
const handler = require("./index");

module.exports = auth0(handler);
```

## Changelog

- 0.1.0 - Refactor
- 0.0.2 - Initial release
