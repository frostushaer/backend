const express = require("express");
const Assessment = require("../models/assessment");
const Instruction = require("../models/instruction");
const Question = require("../models/question");
const Response = require("../models/response");
const Review = require("../models/review");
const TraitwiseRecommendation = require("../models/traitwise_recommendation");
const TopicwiseRecommendation = require("../models/topicwise_recommendation");
<<<<<<< HEAD
const TraitInfo = require("../models/traitinfo");
=======
>>>>>>> origin/master
const axios = require("axios");

const router = express.Router();

// Assessments APIs
router.get("/assessments", async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.json({
      status: true,
      data: assessments,
      message: "Assessments fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching assessments" });
  }
});

// Instructions APIs
router.get("/instructions", async (req, res) => {
  try {
    const instruction = await Instruction.findOne({
      assessment_id: req.query.assessment_id,
    });
    res.json({
      status: true,
      data: instruction,
      message: "Instructions fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching instructions" });
  }
});

// Questions APIs
router.get("/questions", async (req, res) => {
  try {
    const questions = await Question.findOne({
      assessment_id: req.query.assessment_id,
    });
    res.json({
      status: true,
      data: questions,
      message: "Questions fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching questions" });
  }
});

// Responses APIs
router.post("/responses", async (req, res) => {
  try {
    const newResponse = new Response(req.body);
    await newResponse.save();
    res.status(200).json({
      status: true,
      data: newResponse,
      message: "Response saved successfully",
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error saving response" });
  }
});

router.get("/responses", async (req, res) => {
  try {
    const responses = await Response.find({ student_id: req.query.student_id });
    res.json({
      status: true,
      data: responses,
      message: "Responses fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching responses" });
  }
});

// Reviews APIs
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({
      assessment_id: req.query.assessment_id,
    });
    res.json({
      status: true,
      data: reviews,
      message: "Reviews fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching reviews" });
  }
});

router.post("/reviews", async (req, res) => {
  try {
    const { assessment_id, student_id, rating, review } = req.body;

    let existingReview = await Review.findOne({ assessment_id });

    if (existingReview) {
      existingReview.reviews.push({ student_id, rating, review });
      await existingReview.save();
    } else {
      const newReview = new Review({
        assessment_id,
        reviews: [{ student_id, rating, review }],
      });
      await newReview.save();
    }

    res.status(200).json({
      status: true,
      message: "Review saved successfully",
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error saving review" });
  }
});

// Trait Recommendations APIs
router.get("/traits", async (req, res) => {
  try {
    const traitRecommendations = await TraitwiseRecommendation.findOne({
      student_id: req.query.student_id,
    });
    res.json({
      status: true,
      data: traitRecommendations,
      message: "Trait recommendations fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching trait recommendations",
    });
  }
});

// Topic Recommendations APIs
router.get("/topics", async (req, res) => {
  try {
    const topicRecommendations = await TopicwiseRecommendation.findOne({
      assessment_id: req.query.assessment_id,
    });
    res.json({
      status: true,
      data: topicRecommendations,
      message: "Topic recommendations fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching topic recommendations",
    });
  }
});

// Route to process assessment via FastAPI and save to MongoDB
router.post("/process-assessment", async (req, res) => {
  try {
    const assessmentData = req.body;
    const fastApiResponse = await axios.post(
      "https://report-json-endpoint-318620872792.us-west1.run.app/process-assessment",
      assessmentData,
      { headers: { "Content-Type": "application/json" } }
    );

    const fullData = {
      ...assessmentData,
      processed_data: fastApiResponse.data,
    };
    const newAssessment = new Assessment(fullData);
    await newAssessment.save();

    res.status(200).json({
      status: true,
      data: newAssessment,
      message: "Assessment processed and saved successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error processing assessment" });
  }
});

// Route to fetch assessments from MongoDB
router.get("/get-process-assessments", async (req, res) => {
  try {
    const assessments = await Assessment.find();
    res.status(200).json({
      status: true,
      data: assessments,
      message: "Assessments retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: "Error fetching assessments" });
  }
});

// Submit Exam API
router.post("/submit-exam", async (req, res) => {
  try {
    const examData = req.body;
    const newExam = new Assessment(examData);
    await newExam.save();
    res.status(200).json({
      status: true,
      data: newExam,
      message: "Exam submitted successfully",
    });
  } catch (err) {
    res.status(400).json({ status: false, message: "Error submitting exam" });
  }
});

// Fetch Bright Traits
router.get("/analytics/bright-traits", async (req, res) => {
  try {
    const { student_id } = req.query;
    const recommendation = await TraitwiseRecommendation.findOne({ student_id });

    if (!recommendation) {
      return res.status(404).json({
        status: false,
        message: "Recommendation not found",
      });
    }

    const brightTraits = recommendation.recommendation?.Bright_Traits;
    if (!brightTraits) {
      return res.status(404).json({
        status: false,
        message: "Bright traits not found",
      });
    }

    res.json({
      status: true,
      data: brightTraits,
      message: "Bright traits fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching bright traits",
    });
  }
});

// Fetch Dark Traits
router.get("/analytics/dark-traits", async (req, res) => {
  try {
    const { student_id } = req.query;
    const recommendation = await TraitwiseRecommendation.findOne({ student_id });

    if (!recommendation) {
      return res.status(404).json({
        status: false,
        message: "Recommendation not found",
      });
    }

    const darkTraits = recommendation.recommendation?.Dark_Traits;
    if (!darkTraits) {
      return res.status(404).json({
        status: false,
        message: "Dark traits not found",
      });
    }

    res.json({
      status: true,
      data: darkTraits,
      message: "Dark traits fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching dark traits",
    });
  }
<<<<<<< HEAD
});

// Topic-wise Recommendations API
router.get("/topicwise-recommendations", async (req, res) => {
  try {
    const { student_id } = req.query;
    const topicwiseRecommendation = await TopicwiseRecommendation.findOne({ student_id });

    if (!topicwiseRecommendation) {
      return res.status(404).json({
        status: false,
        message: "Topic-wise recommendation not found",
      });
    }

    res.json({
      status: true,
      data: topicwiseRecommendation,
      message: "Topic-wise recommendations fetched successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: false,
      message: "Error fetching topic-wise recommendations",
    });
  }
});

// Trait Infos APIs
router.get("/traitinfos", async (req, res) => {
  try {
    const traitInfos = await TraitInfo.find({
      student_id: req.query.student_id,
    });
    res.json({
      status: true,
      data: traitInfos,
      message: "Trait infos fetched successfully",
    });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching trait infos" });
  }
=======
>>>>>>> origin/master
});

module.exports = router;