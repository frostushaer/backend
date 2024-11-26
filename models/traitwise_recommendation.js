
const mongoose = require("mongoose");

const traitwiseRecommendationSchema = new mongoose.Schema({
    student_id: String,
    name: String,
    class: String,
    roll_number: String,
    schoolName: String,
    schoolId: String,
    email: String,
    board: String,
    phoneNo: String,
    section: String,
    assessment_id: String,
    recommendation: Object,
});

const TraitwiseRecommendation = mongoose.model("TraitwiseRecommendation", traitwiseRecommendationSchema);
module.exports = TraitwiseRecommendation;
