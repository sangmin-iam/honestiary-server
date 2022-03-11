const createError = require("http-errors");
const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");
const Diary = require("../models/Diary");
const { create } = require("../models/Diary");

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  region: process.env.AWS_S3_REGION,
});

exports.uploadS3 = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_S3_BUCKET_NAME,
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

exports.deleteDiaryS3 = async (req, res, next) => {
  try {
    const { diary_id } = req.params;

    const diary = await Diary.findById(diary_id).lean();
    const url = diary.audio.split("/");
    const fileName = url[url.length - 1];

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
    };

    await s3.deleteObject(params).promise();
    next();
  } catch (err) {
    next(createError(err));
  }
};
