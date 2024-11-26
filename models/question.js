
const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    assessment_id: String,
    questions_list: [
        {
            subject: String,
            questions: [
                {
                    question_id: Number,
                    question_image_url: String,
                    question_text: String,
                    options: [
                        {
                            option: String,
                            text: String,
                            option_image_url: String,
                        },
                    ],
                },
            ],
        },
    ],
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
