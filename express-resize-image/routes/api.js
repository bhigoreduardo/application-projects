const express = require("express"),
  bodyParser = require("body-parser");

const router = express.Router();

const resizeimage = require("../model/resizeimage");

router.post("/", bodyParser.json(), (req, res) => {
  let inputFile = `./uploads/${req.session.filename}`,
    widthFile = Number(req.body.widthFile),
    outputFile = `./temp/${req.session.filename}`,
    outputFinalFile = `./compressed/${req.session.filename}`;

  resizeimage.IOdatas(inputFile, widthFile, outputFile, outputFinalFile);

  res.send("Imagem redimensionada e comprimida");
});

module.exports = router;
