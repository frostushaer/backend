
const mongoose = require("mongoose");

const topicwiseRecommendationSchema = new mongoose.Schema({
    attempt_count: Object,
    recommendations: Object,
});

const TopicwiseRecommendation = mongoose.model("TopicwiseRecommendation", topicwiseRecommendationSchema);
module.exports = TopicwiseRecommendation;
