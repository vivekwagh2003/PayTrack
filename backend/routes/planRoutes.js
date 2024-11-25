const express = require('express');
const router = express.Router();
const { getPlans, createPlan,getAdminStats } = require('../controllers/planController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getPlans).post(protect, admin, createPlan);
router.route('/stats').get(getAdminStats)

module.exports = router;