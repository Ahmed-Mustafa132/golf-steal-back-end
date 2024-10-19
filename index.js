const express = module.require("express");
const mongoose = module.require("mongoose");
const dbConn = module.require("./controllers/dbConn");
const cors = require("cors");
const app = express();
require('dotenv').config();
process.env.secret = process.env.SECRET;


app.use(cors());
app.use(express.json());

const userRoute = module.require("./routes/userRoute.js");
const projectRoute = module.require("./routes/projectRoute.js");
const galleryRoute = module.require("./routes/GalleryRoute.js");
app.use("/users", userRoute);
app.use("/projects", projectRoute);
app.use ("/gallery", galleryRoute);
dbConn();


mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });
});
