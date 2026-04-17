const express = require('express');
const router = express.Router();
const TimeLog = require('../models/TimeLog');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, async (req, res) => {
  const logs = await TimeLog.find().lean();
  res.json(logs);
});

router.post('/', verifyToken, async (req, res) => {
  const log = new TimeLog(req.body);
  await log.save();
  res.json(log);
});

router.put('/:id', verifyToken, async (req, res) => {
  const updated = await TimeLog.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

router.delete('/:id', verifyToken, async (req, res) => {
  await TimeLog.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

module.exports = router;
