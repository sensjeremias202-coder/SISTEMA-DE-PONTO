const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const settings = await Setting.find().lean();
  res.json(settings);
});

router.post('/', verifyToken, async (req, res) => {
  const s = new Setting(req.body);
  await s.save();
  res.json(s);
});

router.put('/:id', verifyToken, async (req, res) => {
  const updated = await Setting.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

module.exports = router;
