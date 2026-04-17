const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  cpf: String,
  position: String,
  department: String,
  monthlyHours: Number,
  hourlyRate: Number,
  contract: String,
  status: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Employee', EmployeeSchema);
