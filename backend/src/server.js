const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/agents', require('./routes/gents'));

// Connect to MongoDB
mongoose
  .connect(config.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});