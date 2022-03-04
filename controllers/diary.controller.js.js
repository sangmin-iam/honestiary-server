const createError = require("http-errors");
const differenceInMonths = require("date-fns/differenceInMonths");
const Sentiment = require("sentiment");

const Diary = require("../models/Diary");
const { User } = require("../models/User");
const { RESPONSE } = require("../constants");
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
      result: RESPONSE.SUCCESS,
      data: null,
    });
  } catch (err) {
    next(createError(err));
  }
};

exports.getDiaries = async (req, res, next) => {
  try {
    const { startDate, endDate, page, limit = 9 } = req.query;

    const monthGap = differenceInMonths(new Date(endDate), new Date(startDate));

    if (startDate > endDate || monthGap > 12) {
      next(createError.BadRequest());
      return;
    }

    const { email } = req.user;
    const { _id: userId } = await User.findOne({ email }).select("_id").lean();

    if (page && limit) {
      const total = await Diary.find({
        createdBy: userId,
        $and: [
          { createdAt: { $gte: startDate } },
          { createdAt: { $lte: endDate } },
        ],
      }).countDocuments();

      const diaries = await Diary.find({
        createdBy: userId,
        $and: [
          { createdAt: { $gte: startDate } },
          { createdAt: { $lte: endDate } },
        ],
      })
        .skip((page - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .lean();

      const pages = Math.ceil(total / limit);

      if (page > pages && pages) {
        next();
        return;
      }

      res.status(200).json({
        result: RESPONSE.SUCCESS,
        data: {
          page,
          pages,
          diaries,
          count: total,
        },
      });

      return;
    }

    const diaries = await Diary.find({
      createdBy: userId,
      $and: [
        { createdAt: { $gte: startDate } },
        { createdAt: { $lte: endDate } },
      ],
    }).lean();

    res.json({
      result: RESPONSE.SUCCESS,
      data: {
        diaries,
      },
    });
  } catch (err) {
    next(createError(err));
  }
};
