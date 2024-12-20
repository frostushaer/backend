const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  board: { type: String, required: true, enum: ['CBSE', 'ICSE'] },
  school: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpires: { type: Date }
});

// Export the user model
module.exports = mongoose.model('User', userSchema);
