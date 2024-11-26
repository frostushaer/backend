
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    assessment_id: String,
    reviews: [
        {
            userid: String,
            rating: Number,
            review: String,
        },
    ],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
