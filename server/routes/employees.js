const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const list = await Employee.find().lean();
  res.json(list);
});

router.post('/', verifyToken, async (req, res) => {
  const emp = new Employee(req.body);
  await emp.save();
  res.json(emp);
});

router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', verifyToken, async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
