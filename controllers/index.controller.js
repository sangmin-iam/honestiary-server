const { RESPONSE } = require("../constants");

exports.handleIndex = (req, res, next) => {
  res.json({ result: RESPONSE.SUCCESS, data: null });
};
