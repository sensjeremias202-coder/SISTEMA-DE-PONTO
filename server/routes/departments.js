const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const deps = await Department.find().lean();
  res.json(deps);
});

router.post('/', verifyToken, async (req, res) => {
  const dep = new Department(req.body);
  await dep.save();
  res.json(dep);
});

router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', verifyToken, async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
