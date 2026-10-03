const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const authMiddleware = require('../middleware/auth');

// GET /api/reports - Fetch all reports
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// PATCH /api/reports/:id - Update report status (Protected)
router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const updatedReport = await Report.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(updatedReport);
  } catch (err) {
    res.status(400).json({ message: 'Error updating status' });
  }
});

// DELETE /api/reports/:id - Delete a report (Protected)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting report' });
  }
});

module.exports = router;