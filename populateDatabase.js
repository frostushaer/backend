const mongoose = require("mongoose");
const fs = require("fs");

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://developementdiginamicit:YBEwuhqBdDWOacpX@cluster0.3jduj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Define Schemas
const AssessmentSchema = new mongoose.Schema({}, { strict: false });
const QuestionSchema = new mongoose.Schema({}, { strict: false });
const InstructionSchema = new mongoose.Schema({}, { strict: false });
const ResponseSchema = new mongoose.Schema({}, { strict: false });
const ReviewSchema = new mongoose.Schema({}, { strict: false });
const TopicwiseRecommendationSchema = new mongoose.Schema(
  {},
  { strict: false }
);
const TraitInfoSchema = new mongoose.Schema({}, { strict: false });
const TraitwiseRecommendationSchema = new mongoose.Schema(
  {},
  { strict: false }
);

// Define Models
const Assessment = mongoose.model("Assessment", AssessmentSchema);
const Question = mongoose.model("Question", QuestionSchema);
const Instruction = mongoose.model("Instruction", InstructionSchema);
const Response = mongoose.model("Response", ResponseSchema);
const Review = mongoose.model("Review", ReviewSchema);
const TopicwiseRecommendation = mongoose.model(
  "TopicwiseRecommendation",
  TopicwiseRecommendationSchema
);
const TraitInfo = mongoose.model("TraitInfo", TraitInfoSchema);
const TraitwiseRecommendation = mongoose.model(
  "TraitwiseRecommendation",
  TraitwiseRecommendationSchema
);

// Function to Load Data
const loadData = async () => {
  try {
    const assessmentData = JSON.parse(
      fs.readFileSync("assessment_list.json", "utf8")
    );
    const questionData = JSON.parse(
      fs.readFileSync("questions.json", "utf8")
    );
    const instructionData = JSON.parse(
      fs.readFileSync("instructions.json", "utf8")
    );
    const responseData = JSON.parse(
      fs.readFileSync("response_sample.json", "utf8")
    );
    const reviewData = JSON.parse(
      fs.readFileSync("review.json", "utf8")
    );
    const topicwiseRecommendationData = JSON.parse(
      fs.readFileSync("topicwise_recommendation.json", "utf8")
    );
    const traitInfoData = JSON.parse(
      fs.readFileSync("trait_info.json", "utf8")
    );
    const traitwiseRecommendationData = JSON.parse(
      fs.readFileSync("traitwise_recommendation.json", "utf8")
    );

    // Insert Data into Collections
    await Assessment.insertMany(assessmentData);
    await Question.insertMany(questionData);
    await Instruction.insertMany(instructionData);
    await Response.create(responseData);
    await Review.insertMany(reviewData.assessments);
    await TopicwiseRecommendation.create(topicwiseRecommendationData);
    await TraitInfo.create(traitInfoData);
    await TraitwiseRecommendation.create(traitwiseRecommendationData);

    console.log("Data Imported Successfully");
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Main Execution
const main = async () => {
  await connectDB();
  await loadData();
};

main();
