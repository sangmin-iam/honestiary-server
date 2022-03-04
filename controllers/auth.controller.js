const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { User } = require("../models/User");
const { RESPONSE } = require("../constants");

exports.handleLogin = async (req, res, next) => {
  try {
    const { email, name } = req.body;
    const foundUser = await User.findOne({ email }).lean();
    let user = foundUser;

    if (!foundUser) {
      user = await User.create({
        email,
        name,
      });
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      result: RESPONSE.SUCCESS,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          name: user.name,
        },
        accessToken,
      },
    });
  } catch (err) {
    next(createError(err));
  }
};
