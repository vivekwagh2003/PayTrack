const Plan = require('../models/planModel');
const User = require('../models/userModel');
const Transaction = require('../models/transactionModel');

// Fetch admin statistics
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const activePlans = await Plan.countDocuments({});
    console.log(Plan.countDocuments);
    

    // Fetch revenue per month
    const monthlyRevenue = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' },
        },
      },
      {
        $project: {
          month: '$_id',
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    res.json({
      totalUsers,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
      activePlans,
      monthlyRevenue,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find({});
    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);
    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getPlans, createPlan,getAdminStats};
