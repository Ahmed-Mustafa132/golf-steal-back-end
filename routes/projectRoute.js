const upload = require("../Middlewares/uploadConfig");
const express = module.require("express");
const router = express.Router();
const app = express();
const { getAllProjectes, getById, saveProject } = module.require(
  "../controllers/handelProject"
);
const { auth, restrict } = module.require("../Middlewares/auth");
app.use(express.json());
router.get("/", getAllProjectes);
router.get("/:id", getById);
router.post("/createproject", auth, saveProject);
module.exports = router;
