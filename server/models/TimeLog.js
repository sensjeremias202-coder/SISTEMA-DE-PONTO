const mongoose = require('mongoose');

const TimeLogSchema = new mongoose.Schema({
  employeeId: Number,
  date: String,
  entryTime: String,
  exitTime: String,
  lunchStartTime: String,
  lunchEndTime: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TimeLog', TimeLogSchema);
