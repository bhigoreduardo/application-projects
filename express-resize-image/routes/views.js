const express = require("express"),
  { join } = require("path");

const router = express.Router();

router.use("/", express.static(join(__dirname, "../views")));

module.exports = router;
