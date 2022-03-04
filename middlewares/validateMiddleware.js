const createError = require("http-errors");
const { RESPONSE } = require("../constants");

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);

    if (error) {
      return next(
        createError.BadRequest({
          result: RESPONSE.FAIL,
          message: error.details[0].message,
        })
      );
    }

    next();
  };
};
