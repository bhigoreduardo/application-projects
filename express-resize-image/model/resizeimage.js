const sharp = require("sharp"),
  compress_images = require("compress-images"),
  fs = require("fs");

let inputFile = "",
  widthFile = "",
  outputFile = "",
  outputFinalFile = "";

module.exports = {
  IOdatas: (input, width, output, outputFinal) => {
    inputFile = input;
    widthFile = width;
    outputFile = output;
    outputFinalFile = outputFinal;

    resizeImage(inputFile, widthFile, outputFile)
      .then((resolve) => console.log(resolve.msg))
      .catch((reject) => console.log(reject.msg))
      .then(compressImage);
  },
};

const resizeImage = (inputFile, widthFile, outputFile) => {
  return new Promise((resolve, reject) => {
    sharp(inputFile)
      .resize({ width: widthFile })
      .toFile(outputFile, (err) => {
        if (err) reject({ msg: "Error to resize image" });
        else resolve({ msg: "Resize image well done" });
      });
  });
};

const compressImage = () => {
  compress_images(
    outputFile,
    outputFinalFile,
    { compress_force: false, statistic: true, autoupdate: true },
    false,
    { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
    { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
    { svg: { engine: "svgo", command: "--multipass" } },
    { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
    function (error) {
      if (error) throw error;
      /* Excluir arquivo temp */
      fs.unlink(outputFile, (err) => {
        if (err) throw err;
        console.log(`File unlink: ${outputFile}`);
      });
      /* Excluir arquivo uplaods */
      fs.unlink(inputFile, (err) => {
        if (err) throw err;
        console.log(`File unlink: ${inputFile}`);
      });
    }
  );
};
