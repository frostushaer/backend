
const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
    assessment_id: String,
    assessment_title: String,
    assessment_description: String,
    assessment_display_name: String,
    class: String,
    board: String,
    assessment_duration: String,
    total_number_of_questions: Number,
    without_justification_questions: [Number],
    status: String,
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
