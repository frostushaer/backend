const express = require('express');
const Assessment = require('../models/assessment');
const Instruction = require('../models/instruction');
const Question = require('../models/question');
const Response = require('../models/response');
const Review = require('../models/review');
const TraitwiseRecommendation = require('../models/traitwise_recommendation');
const TopicwiseRecommendation = require('../models/topicwise_recommendation');

const router = express.Router();

// Assessments APIs
router.get('/assessments', async (req, res) => {
    try {
        const assessments = await Assessment.find();
        res.json(assessments);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching assessments', error: err });
    }
});

// Instructions APIs
router.get('/instructions/:id', async (req, res) => {
    try {
        const instruction = await Instruction.findOne({ assessment_id: req.params.id });
        res.json(instruction);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching instructions', error: err });
    }
});

// Questions APIs
router.get('/questions/:id', async (req, res) => {
    try {
        const questions = await Question.findOne({ assessment_id: req.params.id });
        res.json(questions);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching questions', error: err });
    }
});

// Responses APIs
router.post('/responses', async (req, res) => {
    try {
        const newResponse = new Response(req.body);
        await newResponse.save();
        res.status(201).json(newResponse);
    } catch (err) {
        res.status(400).json({ message: 'Error saving response', error: err });
    }
});

router.get('/responses/:studentId', async (req, res) => {
    try {
        const responses = await Response.find({ student_id: req.params.studentId });
        res.json(responses);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching responses', error: err });
    }
});

// Reviews APIs
router.get('/reviews/:id', async (req, res) => {
    try {
        const reviews = await Review.find({ assessment_id: req.params.id });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching reviews', error: err });
    }
});

router.post('/reviews', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json(newReview);
    } catch (err) {
        res.status(400).json({ message: 'Error saving review', error: err });
    }
});

// Trait Recommendations APIs
router.get('/traits/:studentId', async (req, res) => {
    try {
        const traitRecommendations = await TraitwiseRecommendation.findOne({ student_id: req.params.studentId });
        res.json(traitRecommendations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching trait recommendations', error: err });
    }
});

// Topic Recommendations APIs
router.get('/topics/:assessmentId', async (req, res) => {
    try {
        const topicRecommendations = await TopicwiseRecommendation.findOne({ assessment_id: req.params.assessmentId });
        res.json(topicRecommendations);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching topic recommendations', error: err });
    }
});

module.exports = router;