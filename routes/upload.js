const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const router = express.Router();

const DIR = "./uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    let fileName = file.originalname.replace(/[\W_]+/g, ".");
    cb(null, `${Date.now()}-${fileName}`);
  }
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files"));
  } else {
    cb(null, true);
  }
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter }).single(
  "photo"
);

router.use(bodyParser.json());

router.post("/", (req, res, next) => {
  upload(req, res, function(err) {
    if (err) {
      console.log(err);
      return res.status(422).send("an Error occured");
    }
    let { filename } = req.file;
    return res.send(filename);
  });
});

module.exports = router;
