const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Listing",
    required: true
  },
   bookedBy: {                        //  New field
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
    // 🔹 Booking-related fields
  customerName: { type: String, required: true },
  contact: { type: String }, // phone or email
  guests: { type: Number, required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  specialRequests: { type: String }, // optional
  customerName: String,
  quantity: Number,
  status: String,
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
