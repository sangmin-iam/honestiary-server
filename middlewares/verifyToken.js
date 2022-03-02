const jwt = require("jsonwebtoken");
const createError = require("http-errors");

exports.verifyToken = (req, res, next) => {
  const accessToken = req.headers.accesstoken;

  if (!accessToken) {
    next(createError.Unauthorized("You need to login first."));
    return;
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      switch (err.name) {
        case "JsonWebTokenError":
          next(createError.BadRequest("Your token is not verified."));
          return;
        case "TokenExpiredError":
          next(createError.BadRequest("Your token has expired."));
          return;
        default:
          next(createError.Unauthorized("Invalid Token"));
      }
    }

    req.user = user;

    next();
  });
};
