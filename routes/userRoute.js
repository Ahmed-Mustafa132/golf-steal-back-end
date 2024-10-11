
const {
  getall,
  getByid,
  createone,
  login,

} = module.require("../controllers/handelUser");

const express = module.require("express");
const router = express.Router();
const app = express();
app.use(express.json());
router.get("/", getall);
router.post("/singin", createone);
router.get("/:id", getByid);
router.post("/login", login);
module.exports = router;
