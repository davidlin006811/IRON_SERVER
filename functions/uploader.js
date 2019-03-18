const multer = require("multer");
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    var fileName = new Date().toISOString() + file.originalname;
    fileName = fileName.replace(new RegExp(":", "g"), "-");
    console.log("file name: ", fileName);
    cb(null, fileName);
  }
});

/*  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };*/

const uploader = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
  //fileFilter: fileFilter
});
module.exports = uploader;
