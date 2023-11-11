const multer = require("multer");
const path = require("path");

const storage = (destination) => multer.diskStorage({
  destination: destination,
  filename: (req, file, cb) => {
    return cb(null, `${file.filename}_${Date.now()}${path.extname(file.originalname)}`)
  }
});

const fileUpload = (destination) => multer({
  storage: storage(destination),
  limits: {
    fileSize: 2 * 1024 * 1024, //2MB

  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" ||  file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false)
      return cb(new Error('Only .png .jpg .jpeg allowed'));
    }
  },
  onError : function(err, next) {
    return console.log('error', err);
    next(err);
  } 
}).single('file')

module.exports = fileUpload;