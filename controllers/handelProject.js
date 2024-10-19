const express = require("express");
const Project = require("../models/projectModel");

// get all projectes
const getAllProjectes = async (req, res) => {
  const limit = parseInt(req.query.limit) || 0;
  const page = parseInt(req.query.page) || 0;
   
  try {
    const projects = await Project.find({}).skip(page).limit(limit);
    const projectsWithEncodedImages = projects.map(project => {
      const projectObject = project.toObject();
      if (project.Image && project.Image.data) {
        projectObject.encodedImage = `data:${project.Image.contentType};base64,${project.Image.data.toString('base64')}`;
      }
      return projectObject;
    });
    res.send({ count: projects.length, data: projectsWithEncodedImages });
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
    if (project.Image && project.Image.data) {
      projectObject.encodedImage = `data:${project.Image.contentType};base64,${project.Image.data.toString('base64')}`;
    }
    res.send(projectObject);
  } catch (err) {
    res.status(500).send(err.message);
  }
};


// create new project
const saveProject = async (req, res) => {
  try {
    const { name, description, type } = req.body;
    const newProject = new Project({
      name,
      description,
      type,
      Image: {
        data: req.file.buffer,
        contentType: req.file.mimetype
      }
    });

    console.log(req.body);
    console.log(newProject);
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
