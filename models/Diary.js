const mongoose = require("mongoose");

const diarySchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Types.ObjectId,
    index: true,
  },
  audio: {
    type: String,
    required: true,
  },
  script: {
    type: String,
    required: true,
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
