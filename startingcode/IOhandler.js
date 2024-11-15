const fs = require("fs");
// const PNG = require("pngjs").PNG;
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
  const zippedFolder = __dirname + `\\${pathIn}`;
  const unzippedFolder = __dirname + `\\${pathOut}`;
  const zip = await yauzl.open(zippedFolder);

  try {
    for await (const entry of zip) {
      console.log(entry);
      if (entry.filename.endsWith("/")) {
        const readStream = await entry.openReadStream();
        const writeStream = fs.createWriteStream(
          unzippedFolder + `\\${entry.filename}`
        );
        await pipeline(readStream, writeStream);
      }
    }
  } finally {
    await zip.close();
  }
};
unzip("myfile.zip", "output");
/**
 * Description: read all the png files from given directory and return Promise containing array of each png file path
 *
 * @param {string} path
 * @return {promise}
 */
const readDir = (dir) => {};

/**
 * Description: Read in png file by given pathIn,
 * convert to grayscale and write to given pathOut
 *
 * @param {string} filePath
 * @param {string} pathProcessed
 * @return {promise}
 */
const grayScale = (pathIn, pathOut) => {};

module.exports = {
  unzip,
  readDir,
  grayScale,
};
