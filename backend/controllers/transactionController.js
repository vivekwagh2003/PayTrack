

const Razorpay = require("razorpay");
const Transaction = require("../models/transactionModel");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createTransaction = async (req, res) => {
  try {
    const {amount,planId } = req.body;

    // Step 1: Create a Razorpay order
    const razorpayOptions = {
      amount: amount * 100, // Amount in paise
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`, // Unique receipt ID
    };

    const razorpayOrder = await razorpay.orders.create(razorpayOptions);

    // Step 2: Store transaction details in the database
    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      paymentMethod:"razorpay",
      plan:planId,
      razorpayOrderId: razorpayOrder.id, // Link to Razorpay order
      status: "pending", // Track the initial status
    });

    // Step 3: Return the order details to the client
    res.status(201).json({
      success: true,
      transaction,
      razorpayOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    // Fetch transactions for the logged-in user
    const transactions = await Transaction.find({ user: req.user._id })
      .populate("plan", "name price") // Populate plan details (e.g., name and price)
      .sort("-createdAt"); // Sort by most recent first

    // Respond with the transactions
    res.status(200).json(transactions);
  } catch (error) {
    // Handle errors and respond
    res.status(500).json({ message: error.message });
  }
};

const completeTransaction = async (req, res) => {
  try {
    const { transactionId, paymentId } = req.body;

    // Find the transaction by Razorpay order ID
    const transaction = await Transaction.findOne({ razorpayOrderId: transactionId });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Check if the transaction is already completed or not
    if (transaction.status === "completed") {
      return res.status(400).json({ message: "Transaction already completed" });
    }

    // Verify the payment ID with Razorpay (optional: to ensure it's the correct payment)
    const paymentDetails = await razorpay.payments.fetch(paymentId);

    if (paymentDetails.status === "captured") {
      // Update the transaction status to "completed"
      transaction.status = "completed";
      transaction.razorpayPaymentId = paymentId; // Store the Razorpay payment ID
      await transaction.save();

      return res.status(200).json({
        success: true,
        message: "Transaction marked as completed",
      });
    } else {
      return res.status(400).json({ message: "Payment not captured" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { createTransaction, getUserTransactions,completeTransaction };
