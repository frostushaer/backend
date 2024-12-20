const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  assessment_id: String,
  reviews: [
    {
      student_id: String,
      rating: Number,
      review: String,
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
