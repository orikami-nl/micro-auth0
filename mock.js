module.exports = req => {
    const auth = req.headers.authorization;
    if(!auth) {
        const error = new Error("No token");
        error.statusCode = 401;
        throw error;
    }
    if(typeof auth === "string" && auth !== "Bearer OK") {
        const error = new Error("Token invalid");
        error.statusCode = 403;
        throw error;
    }
    return Promise.resolve(typeof auth === "object" ? auth : {
        "sub": "000000001",
        "name": "John Doe"
    });
};
