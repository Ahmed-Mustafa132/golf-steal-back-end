const express = module.require("express");
const mongoose = module.require("mongoose");
const dbConn = module.require("./controllers/dbConn");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

let userRoute = module.require("./routes/userRoute.js");
let projectRoute = module.require("./routes/projectRoute.js");
app.use("/users", userRoute);
app.use("/projects", projectRoute);
dbConn();

mongoose.connection.once("open", () => {
  console.log("Connected to db");
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is running on port 3000");
  });
});
