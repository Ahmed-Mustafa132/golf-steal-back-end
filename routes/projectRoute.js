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

const { getAllProjectes, getById, saveProject } = module.require(
  "../controllers/handelProject"
);

router.get("/", getAllProjectes);
router.get("/:id", getById);
router.post("/createproject", isAdmin, upload.single("image"), saveProject);

module.exports = router;
