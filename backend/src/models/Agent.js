const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  role: { type: String, required: true },
  priorities: [String],
});

module.exports = mongoose.model('Agent', agentSchema);