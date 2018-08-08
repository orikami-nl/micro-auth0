var url = require("url");
var request = require("request");
var jwt = require("jsonwebtoken");

function verifyAuth0(domain, token, role) {
    return new Promise((resolve, reject) => {
        request(
            {
                url: `https://${domain}/userinfo`,
                method: "GET",
                headers: { Authorization: `Bearer ${token}` }
            },
            (err, res, result) => {
                if (err) {
                    err.statusCode = 500;
                    reject(err);
                } else if (result === "Unauthorized") {
                    const error = new Error("Token invalid");
                    error.statusCode = 403;
                    reject(error);
                } else if (res.statusCode !== 200) {
                    const error = new Error(
                        "Auth0 statusCode " + res.statusCode
                    );
                    error.statusCode = 500;
                    reject(error);
                } else {
                    const user = JSON.parse(result);
                    if (
                        role &&
                        (!user["https://orikami-api.nl/roles"] ||
                            user["https://orikami-api.nl/roles"].indexOf(role) <
                                0)
                    ) {
                        const error = new Error(`"${role}" role is required`);
                        error.statusCode = 403;
                        reject(error);
                    } else {
                        resolve(JSON.parse(result));
                    }
                }
            }
        );
    });
}

function verifyjwt(publickey, token) {
    return new Promise((resolve, reject) => {
        try {
            resolve(
                jwt.verify(token, publickey, {
                    algorithms: ["RS256"],
                    ignoreExpiration: true
                })
            );
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = (req, domainOrPublickey, role = null, type = "auth0") => {
    const query = url.parse(req.url || "", true).query || {};
    let token = query.token || "";
    if (
        req.headers.authorization &&
        req.headers.authorization.match(/bearer /i)
    ) {
        token = req.headers.authorization.substr(7);
    }
    if (!token) {
        const error = new Error("No token");
        error.statusCode = 401;
        return Promise.reject(error);
    }
    if (type === "auth0") {
        return verifyAuth0(domainOrPublickey, token, role);
    } else {
        return verifyjwt(domainOrPublickey, token, role);
    }
};
