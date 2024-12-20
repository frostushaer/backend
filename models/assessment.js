const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  question_id: { type: Number, required: true },
  option_selected: { type: String, required: true },
  justification: { type: String, default: "" },
});

const solutionSchema = new mongoose.Schema({
  solution_headline: String,
  solution_bullet_points: [String],
});

const traitSchema = new mongoose.Schema({
  score: String,
  recommendations: {
    statement: String,
    solutions: [solutionSchema],
  },
  average_score: String,
  maximum_score: String,
  ideal_score: String,
});

const recommendationSchema = new mongoose.Schema({
  Bright_Traits: {
    LOGIC: traitSchema,
    CONCENTRATION: traitSchema,
    FOCUS: traitSchema,
    "COGNITIVE SKILL": traitSchema,
    "RETENTION POWER": traitSchema,
    "HARD WORKING": traitSchema,
    "STUDY HABIT": traitSchema,
    CONSCIOUSNESS: traitSchema,
  },
  Dark_Traits: {
    "SILLY MISTAKES": traitSchema,
    "KNOWLEDGE GAP": traitSchema,
    IMPULSIVE: traitSchema,
    "LEARNING GAP": traitSchema,
  },
});

const assessmentSchema = new mongoose.Schema({
  student_id: { type: String, required: true },
  name: String,
  class: String,
  roll_number: String,
  schoolName: String,
  schoolId: String,
  email: String,
  board: String,
  phoneNo: String,
  section: String,
  assessment_id: { type: String, required: true },
  responses: {
    science: [responseSchema],
    math: [responseSchema],
  },
  recommendation: recommendationSchema,
  submitted_at: { type: Date, default: Date.now },
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;