const mongoose = require("mongoose");

const traitSchema = new mongoose.Schema({
  meaning: String,
  example: String,
  factors_affecting_trait: [String],
});

const traitInfoSchema = new mongoose.Schema({
  student_id: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  trait_info: {
    Bright_Trait: {
      LOGIC: traitSchema,
      FOCUS: traitSchema,
      CONCENTRATION: traitSchema,
      "COGNITIVE SKILL": traitSchema,
      "RETENTION POWER": traitSchema,
      "HARD WORKING": traitSchema,
      "STUDY HABIT": traitSchema,
      CONSCIOUSNESS: traitSchema,
    },
    Dark_Trait: {
      "SILLY MISTAKES": traitSchema,
      "KNOWLEDGE GAP": traitSchema,
      IMPULSIVE: traitSchema,
      "LEARNING GAP": traitSchema,
    },
  },
});

const TraitInfo = mongoose.model("TraitInfo", traitInfoSchema);

module.exports = TraitInfo;