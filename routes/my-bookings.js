const express = require("express");
const router = express.Router();
const Order = require("../models/order"); 
const Razorpay = require("razorpay");

// Razorpay instance
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// Middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  console.log("Logged in user:", req.user); // debugging
  if (!req.user) {
    return res.redirect("/login");
  }
  next();
}

// GET all bookings for logged-in user
router.get("/my-bookings", isLoggedIn, async (req, res) => {
  try {
    const orders = await Order.find({ bookedBy: req.user._id }).populate("listing");
    res.render("my-bookings", { orders });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});

// Cancel booking + refund
router.post("/cancelBooking/:id", isLoggedIn, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order || order.bookedBy.toString() !== req.user._id.toString()) {
      return res.json({ success: false, msg: "Unauthorized or booking not found" });
    }

    if (order.status !== "confirmed") {
      return res.json({ success: false, msg: "Booking is not active" });
    }

    // Refund via Razorpay
    await razorpay.payments.refund(order.razorpayPaymentId, {
      amount: order.quantity * 100, // refund full booking amount in paise
    });

    order.status = "refunded";
    await order.save();

    res.json({ success: true, msg: "Refund initiated successfully" });
  } catch (err) {
    console.error("Refund Error:", err);
    res.json({ success: false, msg: "Refund failed" });
  }
});

// Cancel + delete booking
router.delete("/cancelBooking/:id", isLoggedIn, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.bookedBy.toString() !== req.user._id.toString()) {
      return res.json({ success: false, msg: "Unauthorized or booking not found" });
    }

    await Order.findByIdAndDelete(req.params.id);  // delete order

    res.json({ success: true, msg: "Booking cancelled. Refund will be processed within 5–7 days." });
  } catch (err) {
    console.error("Cancel Error:", err);
    res.json({ success: false, msg: "Failed to cancel booking" });
  }
});


module.exports = router;
