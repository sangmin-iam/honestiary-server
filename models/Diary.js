const mongoose = require("mongoose");
const { DIARY } = require("../constants");

const diarySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    index: true,
  },
  audioURL: {
    type: String,
    required: true,
  },
  script: {
    type: String,
    default: DIARY,
  },
  sentiment: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Diary = mongoose.model("Diary", diarySchema);

module.exports = Diary;
