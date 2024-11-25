import React from "react";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";
import { transactionService } from "../services/api"; // Import transactionService
import axios from "axios";
import { useNavigate } from "react-router-dom";


const PaymentButton = ({ amount ,planId}) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Step 1: Create a transaction and Razorpay order via the backend
      const transactionResponse = await transactionService.createTransaction({
        amount, // Pass the payment amount
        planId,
      });

      // Extract the order and transaction details from the response
      const { razorpayOrder, transaction } = transactionResponse.data;

      console.log("Transaction created:", transaction);
      console.log("Razorpay order:", razorpayOrder);

      // Step 2: Configure Razorpay options
      const options = {
        key: "rzp_test_yXGnv7hXNEqAqQ", // Replace with your Razorpay test key
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Test Payment",
        description: "Razorpay Payment Integration",
        order_id: razorpayOrder.id, // Razorpay order ID
        handler: async (response) => {
          // Check if payment was successful by verifying the payment ID
          if (response?.razorpay_payment_id) {
            try {
              // If payment is successful, mark the transaction as 'completed'
              const paymentResponse = await axios.post('https://spm-mini-project.onrender.com/api/transactions/complete', {
                transactionId: razorpayOrder.id, // Use Razorpay order ID to find the transaction
                paymentId: response.razorpay_payment_id, // Payment ID from Razorpay
              });
              
              // Notify user that the payment was successful
              alert(`Payment successful. Payment ID: ${response.razorpay_payment_id}`);
              navigate("/dashboard")
              
            } catch (error) {
              console.error("Error updating transaction status:", error);
              alert("There was an issue updating the transaction status.");
            }
          } else {
            alert("Payment failed. Please try again.");
          }
        },
        prefill: {
          name: user?.name || "Guest",
          email: user?.email || "guest@example.com",
          contact: user?.phoneNumber || "1234567890",
        },
        theme: {
          color: "#3399cc",
        },
      };
      

      // Step 3: Open Razorpay checkout
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
        console.error("Payment error details:", error.response?.data || error.message);
        alert("Something went wrong. Please try again.");
      }
      
  };

  return (
    <Button
      onClick={handlePayment}
      size="lg"
      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
    >
      <CreditCard className="mr-2 h-5 w-5" />
      Pay ₹{amount.toLocaleString()}
    </Button>
  );
};

export default PaymentButton;
