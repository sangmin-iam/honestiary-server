const createError = require("http-errors");

module.exports = (validator) => {
  return (req, res, next) => {
    const { error } = validator(req.body);

    if (error) {
      return next(
        createError.BadRequest({
          result: "failed",
          message: error.details[0].message,
        })
      );
    }

    next();
  };
};
