const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // User model
const router = express.Router();
require('dotenv').config();

// Register Route
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Hash the password before saving
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already registered!' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
   
  } catch (error) {
    console.log("dsjhfgdshjfg ", error);
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) return res.status(200).json({ message: 'Invalid username or password' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(200).json({ message: 'Invalid username or password' });

    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h' // Token valid for 1 hour
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
