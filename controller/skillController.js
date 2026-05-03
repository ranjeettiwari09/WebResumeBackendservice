const mongoose = require("mongoose");
const Skills = require("../models/Skils");

const createSkill = async (req, res) => {
  try {
    const { name, proficiency, description } = req.body;
    const newSkill = new Skills({
      skill: name,
      proficiency,
      description,
    });

    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(500).json({ error: "Failed to create skill" });
  }
};

const getSkills = async (req, res) => {
  try {
    const skills = await Skills.find();
    res.status(200).json(skills);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve skills" });
  }
};

const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const skill = await Skills.findById(id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve skill" });
  }
};

const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, proficiency, description } = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const skill = await Skills.findByIdAndUpdate(
      id,
      { skill: name, proficiency, description },
      { new: true },
    );

    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json(skill);
  } catch (error) {
    res.status(500).json({ error: "Failed to update skill" });
  }
};

const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }
    const skill = await Skills.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ error: "Skill not found" });
    }
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete skill" });
  }
};

module.exports = {
  createSkill,
  getSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
};
