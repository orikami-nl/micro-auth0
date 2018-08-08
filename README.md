# micro-auth0

Helper to get user using Auth0

## Install
```
npm install --save @orikami/micro-auth0
```

## Usage

```js
const { send } = require('micro');
const auth0 = require('./packages/micro-auth0');

module.exports = async (req,res) => {
  const user = await auth0(req, process.env.AUTH0_DOMAIN,"admin" /* role, optional */);
  if(!user) return send(res,403,{ error: "Forbidden" });
  return {
      date: new Date(),
      user: user
    };
};
```

The third optional argument checks for a `role` to be present. Auth0 should
 add https://orikami-api.nl/roles to the user profile (`id token`).

Use https://orikami.eu.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/users to configure roles and users.
