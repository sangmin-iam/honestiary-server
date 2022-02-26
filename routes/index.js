const express = require("express");
const router = express.Router();

const { handleIndex } = require("../controllers/index.controller");

router.get("/", handleIndex);

module.exports = router;
