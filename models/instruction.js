
const mongoose = require("mongoose");

const instructionSchema = new mongoose.Schema({
    assessment_id: String,
    assessment_display_name: String,
    class: String,
    board: String,
    assessment_duration: String,
    assessment_instructions: Object,
});

const Instruction = mongoose.model("Instruction", instructionSchema);
module.exports = Instruction;
