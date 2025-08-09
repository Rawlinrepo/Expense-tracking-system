const express = require('express');
const { getExpenses } = require('../controllers/expenseController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/expenses', authenticateToken, getExpenses);

module.exports = router;
