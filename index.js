const express = module.require("express");
const mongoose = module.require("mongoose");
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const userRoute = module.require("./routes/userRoute.js");
const projectRoute = module.require("./routes/projectRoute.js");
const galleryRoute = module.require("./routes/GalleryRoute.js");
app.use("/users", userRoute);
app.use("/projects", projectRoute);
app.use("/gallery", galleryRoute);

const dbConn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
dbConn();

mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });
});
