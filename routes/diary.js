const express = require("express");
const router = express.Router();

const { createDiary } = require("../controllers/diary.controller.js");
const { uploadS3 } = require("../middlewares/multer.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.post("/", verifyToken, uploadS3.single("audio"), createDiary);

module.exports = router;
