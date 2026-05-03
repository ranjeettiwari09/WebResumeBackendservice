const mongoose = require("mongoose");
const Education = require("../models/Education");

const createEducation = async (req, res) => {
  try {
    const {
      degree,
      institution,
      startDate,
      endDate,
      fieldOfStudy,
      description,
    } = req.body;
    const newEducation = new Education({
      degree,
      institution,
      startDate,
      fieldOfStudy,
      description,
      endDate,
    });
    await newEducation.save();
    res.status(201).json(newEducation);
  } catch (error) {
    res.status(500).json({ error: "Failed to create education entry" });
  }
};

const getEducations = async (req, res) => {
  try {
    // Sort by startDate descending — most recent first
    const educations = await Education.find().sort({ startDate: -1 });
    res.status(200).json(educations);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve education entries" });
  }
};

const getEducationById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const education = await Education.findById(id);
    if (!education) {
      return res.status(404).json({ error: "Education entry not found" });
    }
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve education entry" });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { id } = req.params;
    const { degree, institution, startDate, endDate, fieldOfStudy, description } =
      req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const education = await Education.findByIdAndUpdate(
      id,
      { degree, institution, startDate, endDate, fieldOfStudy, description },
      { new: true },
    );

    if (!education) {
      return res.status(404).json({ error: "Education entry not found" });
    }
    res.status(200).json(education);
  } catch (error) {
    res.status(500).json({ error: "Failed to update education entry" });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const education = await Education.findByIdAndDelete(id);
    if (!education) {
      return res.status(404).json({ error: "Education entry not found" });
    }
    res.status(200).json({ message: "Education entry deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete education entry" });
  }
};

module.exports = {
  createEducation,
  getEducations,
  getEducationById,
  updateEducation,
  deleteEducation,
};
