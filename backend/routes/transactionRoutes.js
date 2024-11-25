const express = require('express');
const router = express.Router();
const { createTransaction, getUserTransactions, completeTransaction } = require('../controllers/transactionController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').post(protect, createTransaction).get(protect, getUserTransactions);
router.route('/complete').post(completeTransaction)
module.exports = router;