const multer = require("multer");

// -- checking the file type --//
const MIME_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images');
  },
  filename: (req, file, callback) => {
    const extension = MIME_TYPES[file.mimetype];
    callback(null, Date.now() + "." + extension);
  }
});

module.exports = multer({ storage: storage }).single("image");

// single("image"); we have to use in postmon and in frontend this name "image"
