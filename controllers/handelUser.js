var jwt = module.require("jsonwebtoken");
const bcrypt = module.require("bcrypt");
const usermodel = module.require("../models/usersModel");

const getall = async (req, res) => {
  try {
    let users = await usermodel.find();
    const count = await usermodel.countDocuments({});
    res.json({ message: "all users", totaldocs: count, data: users });
  } catch (e) {
    res.json({ message: e.message });
  }
};

const getByid = async (req, res) => {
  try {
    let { id } = req.params;
    let user = await usermodel.findById(id);
    if (user) {
      res.status(200).json({ data: user });
    } else {
      res.status(400).json({ message: "can not be fouund" });
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const createone = async (req, res) => {
  try {
    let newuser = req.body;
    console.log(newuser);
    let inserteduser = await usermodel.create(newuser);
    res.status(201).json({ message: "created", data: inserteduser });
  } catch (err) {
    res.status(400).json({ message: "can not be created", error: err.message });
  }
};


const login = async (req, res) => {
  let { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.json({ message: "required" });
  }
  let user = await usermodel.findOne({ email: email });
  if (!user) {
    return res.json({ message: "invalid email or password" });
  }
  let isvalid = await bcrypt.compare(password, user.password);
  if (!isvalid) {
    return res.json({ message: "invalid email or password " });
  }
  let token = jwt.sign(
    { data: { email: user.email, id: user._id, role: user.role } },
    process.env.secret,
    { expiresIn: "3h" }
  );
  return res.json({ message: "success", token: token });
};

module.exports = {
  getall,
  getByid,
  createone,
  login,
};
