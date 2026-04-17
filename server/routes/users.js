const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

// List users
router.get('/', verifyToken, async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
});

// Create user
router.post('/', verifyToken, async (req, res) => {
  const data = req.body;
  const hashed = await bcrypt.hash(data.password || 'changeme', 10);
  const user = new User({ ...data, email: data.email.toLowerCase(), password: hashed });
  await user.save();
  res.json(user);
});

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  const updated = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete user
router.delete('/:id', verifyToken, async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
