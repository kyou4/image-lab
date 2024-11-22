const fs = require("fs");
const PNG = require("pngjs").PNG;
const path = require("path");
const yauzl = require("yauzl-promise");
const { pipeline } = require("stream/promises");
/**
 * Description: decompress file from given pathIn, write to given pathOut
 *
 * @param {string} pathIn
 * @param {string} pathOut
 * @return {promise}
 */

const unzip = async (pathIn, pathOut) => {
  const zip = await yauzl.open(pathIn);
  try {
    await fs.promises.mkdir(pathOut, { recursive: true });
    for await (const entry of zip) {
      if (entry.filename.endsWith("/")) {
        await fs.promises.mkdir(path.join(pathOut, entry.filename), {
          recursive: true,
        });
      } else {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          path.join(pathOut, entry.filename)
        );
        await pipeline(readStream, writeStream);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await zip.close();
    console.log("Extraction operation complete");
  }
};

/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = async (dir) => {
  try {
    const files = await fs.promises.readdir(dir);
    const filteredFile = files.filter(
      (element) => path.extname(element) === ".png"
    );
    return filteredFile;
    // const photoPath = filteredFile.map((element) => path.join(dir, element));
    // return photoPath;
  } catch (error) {
    console.log(error);
  }
};
/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = async (pathIn, pathOut) => {
  try {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;
            const gray =
              (this.data[idx] + this.data[idx + 1] + this.data[idx + 2]) / 3;

            this.data[idx] = gray;
            this.data[idx + 1] = gray;
            this.data[idx + 2] = gray;
          }
        }

        this.pack().pipe(fs.createWriteStream(pathOut));
      });
  } catch (error) {
    console.log(error);
  }
};

const sepia = async (pathIn, pathOut) => {
  try {
    fs.createReadStream(pathIn)
      .pipe(new PNG())
      .on("parsed", function () {
        for (var y = 0; y < this.height; y++) {
          for (var x = 0; x < this.width; x++) {
            var idx = (this.width * y + x) << 2;

            let newRed =
              this.data[idx] * 0.393 +
              this.data[idx + 1] * 0.769 +
              this.data[idx + 2] * 0.189;
            let newGreen =
              this.data[idx] * 0.349 +
              this.data[idx + 1] * 0.686 +
              this.data[idx + 2] * 0.168;
            let newBlue =
              this.data[idx] * 0.272 +
              this.data[idx + 1] * 0.534 +
              this.data[idx + 2] * 0.131;

            if (newRed > 255) newRed = 255;
            if (newGreen > 255) newGreen = 255;
            if (newBlue > 255) newBlue = 255;

            this.data[idx] = newRed;
            this.data[idx + 1] = newGreen;
            this.data[idx + 2] = newBlue;
          }
        }

        this.pack().pipe(fs.createWriteStream(pathOut));
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  unzip,
  readDir,
  grayScale,
  sepia,
};
