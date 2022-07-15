const express = require("express"),
  multer = require("multer"),
  { extname } = require("path");

const router = express.Router();

let filename = "";

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "uploads/");
  },
  filename: function (req, file, callback) {
    filename = file.originalname + Date.now() + extname(file.originalname);
    callback(null, filename);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("inputFile"), (req, res) => {
  req.session.filename = filename;
  res.render("resizeimage");
});

module.exports = router;
