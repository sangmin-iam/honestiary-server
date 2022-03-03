const createError = require("http-errors");
const differenceInMonths = require("date-fns/differenceInMonths");
const Sentiment = require("sentiment");

const Diary = require("../models/Diary");
const { User } = require("../models/User");

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

exports.getPaginatedDiaries = async (req, res, next) => {
  try {
    let query = Diary.find();

    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * pageSize;
    const total = await Diary.countDocuments();

    const pages = Math.ceil(total / pageSize);

    query = query.skip(skip).limit(pageSize);

    if (page > pages) {
      next();
      return;
    }

    const result = await query;

    res.status(200).json({
      result: "success",
      data: {
        page,
        pages,
        diaries: result,
        count: result.length,
      },
    });
  } catch (err) {
    next(createError(err));
  }
};

exports.getDiaries = async (req, res, next) => {
  try {
    const { startDate, endDate } = req.query;

    const monthGap = differenceInMonths(new Date(endDate), new Date(startDate));

    if (startDate > endDate || monthGap > 12) {
      next(createError.BadRequest());
      return;
    }

    const { email } = req.user;
    const { _id: userId } = await User.findOne({ email }).select("_id").lean();

    const diaries = await Diary.find({
      createdBy: userId,
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ],
    });

    res.json({
      result: "success",
      data: {
        diaries,
      },
    });
  } catch (err) {
    next(createError(err));
  }
};
