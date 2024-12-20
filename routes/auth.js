const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model
const router = express.Router();
require('dotenv').config();
const crypto = require('crypto');

// Function to generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register Route
router.post('/register', async (req, res) => {
  const { fullName, email, board, school, phoneNumber, password } = req.body;

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { phoneNumber }] });
    if (existingUser) {
      return res.status(409).json({ status: false, data: null, message: 'User already registered!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    const newUser = new User({ fullName, email, board, school, phoneNumber, password: hashedPassword, otp, otpExpires });
    await newUser.save();

    // Send OTP to user's phone number (implementation depends on your SMS service provider)
    // For example, using Twilio:
    // await sendOtpToPhoneNumber(phoneNumber, otp);

    res.status(200).json({ status: true, data: { otp }, message: 'User registered successfully! Please verify OTP sent to your phone number.' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error registering user', error });
  }
});

// OTP Verification Route
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ status: false, data: null, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ status: false, data: null, message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ status: true, data: { token }, message: 'OTP verified successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error verifying OTP', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });
    if (!user) return res.status(200).json({ status: false, data: null, message: 'Invalid email/phone number or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).json({ status: false, data: null, message: 'Invalid email/phone number or password' });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h'
    });

    res.json({ status: true, data: { token }, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error logging in', error });
  }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
  const { identifier } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });
    if (!user) return res.status(404).json({ status: false, data: null, message: 'User not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // Send OTP to user's phone number or email (implementation depends on your SMS/email service provider)
    // For example, using Twilio for SMS or Nodemailer for email:
    // await sendOtpToPhoneNumber(user.phoneNumber, otp);
    // await sendOtpToEmail(user.email, otp);

    res.json({ status: true, data: { otp }, message: 'OTP sent successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error sending OTP', error });
  }
});

// Verify OTP for Password Reset Route
router.post('/verify-otp-reset', async (req, res) => {
  const { identifier, otp } = req.body;

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });
    if (!user) return res.status(404).json({ status: false, data: null, message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ status: false, data: null, message: 'Invalid or expired OTP' });
    }

    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.json({ status: true, data: null, message: 'OTP verified successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error verifying OTP', error });
  }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
  const { identifier, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ status: false, data: null, message: 'Passwords do not match' });
  }

  try {
    const user = await User.findOne({ $or: [{ email: identifier }, { phoneNumber: identifier }] });
    if (!user) return res.status(404).json({ status: false, data: null, message: 'User not found' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ status: true, data: null, message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error resetting password', error });
  }
});

// Profile Route
router.get('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: false, data: null, message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) return res.status(404).json({ status: false, data: null, message: 'User not found' });

    res.json({ status: true, data: user, message: 'Profile fetched successfully' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error fetching profile', error });
  }
});

// Edit Profile Route
router.put('/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ status: false, data: null, message: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  const { email, fullName, board, school, phoneNumber } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) return res.status(404).json({ status: false, data: null, message: 'User not found' });

    user.email = email || user.email;
    user.fullName = fullName || user.fullName;
    user.board = board || user.board;
    user.school = school || user.school;
    user.phoneNumber = phoneNumber || user.phoneNumber;

    await user.save();

    res.json({ status: true, data: null, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ status: false, data: null, message: 'Error updating profile', error });
  }
});

module.exports = router;