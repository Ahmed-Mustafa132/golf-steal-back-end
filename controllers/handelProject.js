const fs = require("fs");
const path = require("path");
const Project = require("../models/projectModel");

// get all projects with pagination
const getAllProjectes = async (req, res) => {
  const limit = parseInt(req.query.limit) || 7;
  const page = parseInt(req.query.page) || 0;

  try {
    const total = await Project.countDocuments();
    const projects = await Project.find({})
      .skip(page * limit)
      .limit(limit);

    const projectsWithEncodedImages = projects.map((project) => {
      const projectObject = project.toObject();
      if (project.Image && typeof project.Image.data === "string") {
        const imagePath = path.join(
          __dirname,
          "..",
          "projects",
          project.Image.data
        );
        if (fs.existsSync(imagePath)) {
          const imgBuffer = fs.readFileSync(imagePath);
          projectObject.encodedImage = `data:${
            project.Image.contentType
          };base64,${imgBuffer.toString("base64")}`;
        } else {
          projectObject.encodedImage = null;
        }
      } else {
        projectObject.encodedImage = null;
      }
      return projectObject;
    });

    res.send({ count: total, page, limit, data: projectsWithEncodedImages });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// get project by id
const getById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    const projectObject = project.toObject();
    if (project.Image && typeof project.Image.data === "string") {
      const imagePath = path.join(
        __dirname,
        "..",
        "projects",
        project.Image.data
      );
      if (fs.existsSync(imagePath)) {
        const imgBuffer = fs.readFileSync(imagePath);
        projectObject.encodedImage = `data:${
          project.Image.contentType
        };base64,${imgBuffer.toString("base64")}`;
      } else {
        projectObject.encodedImage = null;
      }
    } else {
      projectObject.encodedImage = null;
    }
    res.send(projectObject);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// create new project and save image as file
const saveProject = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    let imageData = null;
    let contentType = null;
    let fileName = null;

    if (req.file) {
      const projectsDir = path.join(__dirname, "..", "projects");
      if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir);
      }
      fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(projectsDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);
      imageData = fileName;
      contentType = req.file.mimetype;
    }

    const newProject = new Project({
      name,
      description,
      type,
      Image: imageData
        ? {
            data: imageData,
            contentType: contentType,
          }
        : undefined,
    });

    await newProject.save();
    res.status(201).send(newProject);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
};

module.exports = {
  getAllProjectes,
  getById,
  saveProject,
};
