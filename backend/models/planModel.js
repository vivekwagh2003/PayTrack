const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  data: {
    type: Number,
    required: true,
  },
  validity: {
    type: Number,
    required: true,
  },
  features: [{
    type: String,
  }],
}, {
  timestamps: true,
});

const Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;