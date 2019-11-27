var url = require("url");
var jwt = require("jsonwebtoken");
const auth0 = require("./auth0");

module.exports = (opts = {}) => handler => async (req, res) => {
  // Get token from query-string (?token=)
  const query = url.parse(req.url || "", true).query || {};
  let token = query.token || "";

  // Get token from x-forwarded-uri header (?token=)
  const fwdQuery = url.parse(req.headers["x-forwarded-uri"] || "").query || {};
  token = token || fwdQuery.token;

  // Get token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.match(/bearer /i)
  ) {
    token = req.headers.authorization.substr(7);
  }

  // Fail if no token is supplied
  if (!token) {
    res.statusCode = 401;
    throw new Error("No token");
  }

  // Try to verify JWT token
  try {
    const jwtOptions = Object.assign({}, auth0.jwt, opts.jwt || {});
    const publickey = opts.publickey || auth0.publickey;
    req.token = jwt.verify(token, publickey, jwtOptions);

    // We use an Auth0 extension for Authorization
    // Using a rule, the token will have an array of roles.
    // See https://orikami.eu8.webtask.io/adf6e2f2b84784b57522e3b19dfc9201/admins/login
    if (opts.roles && opts.roles.allowed && opts.roles.key) {
      const roles = req.token[opts.roles.key];
      if (roles.every(role => opts.roles.allowed.indexOf(role) < 0)) {
        throw new Error(
          `Forbidden for ${roles.join(", ")}, need: ${opts.roles.allowed.join(
            ", "
          )}`
        );
      }
    }
  } catch (err) {
    res.statusCode = 403;
    throw err;
  }

  // All OK, run handler
  return await handler(req, res);
};
