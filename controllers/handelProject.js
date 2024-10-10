const express = require("express");
const Project = require("../models/projectModel");

// get all projectes
const getAllProjectes = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.send({ count: projects.length, data: projects });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// get project by id
const getById = async (req, res) => {
  // console.log(req.params.id);
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    console.log(project);
    if (!project) {
      return res.status(404).send("Project not found");
    }
    res.send(project);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// create new project
const saveProject = async (req, res) => {
  try {
    const { name, description, type, Image } = req.body;
    const newProject = new Project({
      name,
      description,
      type,
      Image,
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
