const Project = require("../models/Project");
const mongoose = require("mongoose");

const createProject = async (req, res) => {
  try {
    const { link, description, title } = req.body;
    const imageVedio = req.file ? req.file.path : "";

    const project = new Project({
      link,
      imageVedio,
      description,
      title,
    });

    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

const getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve projects" });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve project" });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { link, description, title } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const updateData = { link, description, title };

    if (req.file) {
      updateData.imageVedio = req.file.path;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ error: "Failed to update project" });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
