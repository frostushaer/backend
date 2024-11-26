
const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
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
    responses: Object,
});

const Response = mongoose.model("Response", responseSchema);
module.exports = Response;
