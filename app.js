const express = require('express');
const apiRoutes = require('./routes/api');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
require('dotenv').config();
const connectToMongoDB = require('./models/connect_db')


const app = express();

// Middleware to parse JSON requests
app.use(express.json());
connectToMongoDB();
// MongoDB connection
// mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('Connected to MongoDB'))
//   .catch((error) => console.error('MongoDB connection error:', error));

// Routes
app.use('/api/auth', authRoutes);

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use('/api', apiRoutes);
