const express = module.require("express");
const router = express.Router();
const multer = require("multer");
const { isAdmin } = require('../middleware/authMiddleware');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
  }
});

const { getAllGallery, creatGallery } = module.require(
  "../controllers/handelGallery"
);

router.get("/", getAllGallery);
router.post("/creatGallery", isAdmin, upload.single("image"), creatGallery);

module.exports = router;
