const mongoose = require("mongoose");
const Experience = require("../models/Experience");

const createExperience = async (req, res) => {
  try {
    const { role, company, location, startDate, endDate, description } =
      req.body;
    const experience = new Experience({
      role,
      company,
      location,
      startDate,
      endDate,
      description,
    });
    await experience.save();
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getExperiences = async (req, res) => {
  try {
    // Sort by startDate descending — most recent first
    const experiences = await Experience.find().sort({ startDate: -1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const getExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const experience = await Experience.findById(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { role, company, location, startDate, endDate, description } =
      req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const experience = await Experience.findByIdAndUpdate(
      id,
      { role, company, location, startDate, endDate, description },
      { new: true },
    );
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

const deleteExperience = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const experience = await Experience.findByIdAndDelete(id);
    if (!experience) {
      return res.status(404).json({ message: "Experience not found" });
    }
    res.json({ message: "Experience deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createExperience,
  getExperiences,
  getExperienceById,
  updateExperience,
  deleteExperience,
};
