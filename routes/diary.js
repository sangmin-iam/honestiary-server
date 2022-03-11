const express = require("express");
const router = express.Router();

const {
  createDiary,
  getDiaries,
  getDiary,
  deleteDiary,
} = require("../controllers/diary.controller.js");
const { uploadS3, deleteDiaryS3 } = require("../middlewares/multer.js");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/", verifyToken, getDiaries);
router.post("/", verifyToken, uploadS3.single("audio"), createDiary);

router.get("/:diary_id", verifyToken, getDiary);
router.delete("/:diary_id", verifyToken, deleteDiaryS3, deleteDiary);

module.exports = router;
