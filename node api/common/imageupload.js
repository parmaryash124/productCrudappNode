const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() + "-"  + Math.floor(Math.random() * (120 - 10) + 10) +`${path.extname(file.originalname)}` ;
    cb(null, uniqueSuffix);
  },
});
const upload = multer({ storage: storage });
module.exports = upload;
