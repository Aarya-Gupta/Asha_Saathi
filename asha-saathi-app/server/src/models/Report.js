const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  actionPoints: {
    type: [String],
    required: true,
  },
  originalText: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Report', ReportSchema);