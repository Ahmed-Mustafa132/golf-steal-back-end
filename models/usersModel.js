const mongoose = module.require("mongoose");
const bcrypt = module.require("bcrypt");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trum: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trum: true,
    validate: {
      validator: function (val) {
        return /^[a-zA-Z0-9]{3,50}@(gmail|yahoo)(.com)$/.test(val);
      },
      message: () => `invaild mail or password`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: "Admin",
    default: "Admin",
  },
  image: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt(10);
  let hashpassword = await bcrypt.hash(this.password, salt);
  this.password = hashpassword;

  next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;
