const path = require("path");
const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");
const pathProcessedSepia = path.join(__dirname, "sepia");

const main = async () => {
  try {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
    const files = await IOhandler.readDir(pathUnzipped);
    for (let picture of files) {
      await IOhandler.grayScale(
        path.join(pathUnzipped, picture),
        path.join(pathProcessed, picture)
      );
    }
  } catch (error) {
    console.log(error);
  }
};

main();
