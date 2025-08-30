const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  type: String,
  Image: {
    data: String, 
    contentType: String
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;