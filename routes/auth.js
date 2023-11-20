const jwt = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const secret = require("../config").secret;

function getTokenFromHeader(req) {
  if (!req.headers.authorization) return null;
  const token = req.headers.authorization.split(" ");
  if (token[0] !== "Bearer") return null;
  req.user = jsonwebtoken.verify(token[1], secret);
  return token[1];
}

const auth = {
  required: jwt({
    secret,
    userProperty: "payload",
    getToken: getTokenFromHeader,
  }),
  optional: jwt({
    secret,
    userProperty: "payload",
    credentialsRequired: false,
    getToken: getTokenFromHeader,
  }),
};

module.exports = auth;
