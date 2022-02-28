const express = require("express");
const router = express.Router();

const validateMiddleware = require("../middlewares/validateMiddleware");
const { validateUser } = require("../models/User");
const { handleLogin } = require("../controllers/auth.controller");

router.post("/login", [validateMiddleware(validateUser)], handleLogin);

module.exports = router;
