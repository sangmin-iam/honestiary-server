const Diary = require("../models/Diary");
const { User } = require("../models/User");
const Sentiment = require("sentiment");
const createError = require("http-errors");

const sentiment = new Sentiment();

exports.createDiary = async (req, res, next) => {
  try {
    const { email } = req.user;
    const { script } = req.body;
    const audio = req.file.location;

    const sentimentResult = sentiment.analyze(script);

    const { _id: userId } = await User.findOne({ email }).select("_id").lean();

    const newDiary = {
      audio,
      script,
      sentiment: sentimentResult.score,
      createdAt: new Date().toISOString(),
      createdBy: userId,
    };

    await Diary.create(newDiary);

    res.json({
      result: "success",
      data: null,
    });
  } catch (err) {
    next(createError(err));
  }
};
