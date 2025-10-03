const Razorpay = require("razorpay");
const Order = require("../models/order"); // make sure path is correct
const { RAZORPAY_ID_KEY, RAZORPAY_SECRET_KEY } = process.env;

const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_ID_KEY,
  key_secret: RAZORPAY_SECRET_KEY,
});

// Render product page
const renderProductPage = async (req, res) => {
  try {
    res.render("show");
  } catch (error) {
    console.log(error.message);
  }
};

// =======================
// Step 1: Create Razorpay Order (NO DB SAVE)
// =======================
const createOrder = async (req, res) => {
  try {
    const {
      name,
      amount, // price per night
      description,
      listingId,
      customerName,
      contact,
      guests,
      checkIn,
      checkOut,
      specialRequests
    } = req.body;

    // Validate contact number
    if (!/^\d{10}$/.test(contact)) {
      return res.status(200).send({
        success: false,
        msg: "Contact number must be exactly 10 digits.",
      });
    }

    // Validate dates
    const today = new Date().setHours(0, 0, 0, 0);
    const checkInDate = new Date(checkIn).setHours(0, 0, 0, 0);
    const checkOutDate = new Date(checkOut).setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      return res.status(200).send({
        success: false,
        msg: "Check-in date cannot be in the past.",
      });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(200).send({
        success: false,
        msg: "Check-out date must be after check-in date.",
      });
    }

    // Nights calculation
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const oneDay = 24 * 60 * 60 * 1000;
    const nights = Math.round((end - start) / oneDay);

    if (nights < 1) {
      return res.status(200).send({
        success: false,
        msg: "⚠️ Minimum stay is 1 night."
      });
    }

    // Multiply price with number of nights
    const totalAmount = amount * nights; // ₹
    const finalAmount = totalAmount * 100; // convert to paisa

    // Check if dates overlap for same listing (only confirmed bookings matter)
    const conflict = await Order.findOne({
      listing: listingId,
      status: "success", //  only check confirmed bookings
      $or: [
        {
          checkIn: { $lte: new Date(checkOut) },
          checkOut: { $gte: new Date(checkIn) }
        }
      ]
    });

    if (conflict) {
      return res.status(200).send({
        success: false,
        msg: "For this listing, the date you entered is already booked. Please choose another date."
      });
    }

    // Create Razorpay order
    const options = {
      amount: finalAmount,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    razorpayInstance.orders.create(options, (err, order) => {
      if (!err) {
        res.status(200).send({
        success: true,
        msg: "Order Created",
        order_id: order.id,
        amount: finalAmount,
        key_id: RAZORPAY_ID_KEY,
        product_name: name,
        description,
        contact,
        name: customerName,
        email: req.user.email || "guest@example.com",
        nights,
        totalAmount,
        checkIn,     // 🔑 include these
        checkOut,
        guests,
        specialRequests,
        listingId
      });

      } else {
        res.status(400).send({ success: false, msg: "Something went wrong!" });
      }
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ success: false, msg: "Server error occurred" });
  }
};

// =======================
// Step 2: Confirm Payment (Save Booking in DB)
// =======================
const confirmPayment = async (req, res) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      listingId,
      customerName,
      contact,
      guests,
      checkIn,
      checkOut,
      specialRequests,
      email
    } = req.body;

    // Save new confirmed booking
    const newOrder = new Order({
      listing: listingId,
      bookedBy: req.user._id,
      customerName,
      contact,
      guests,
      checkIn,
      checkOut,
      specialRequests,
      status: "success",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      email
    });

    await newOrder.save();

    res.status(200).send({
      success: true,
      msg: "Payment confirmed and booking saved",
      order: newOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, msg: "Error confirming payment" });
  }
};

module.exports = {
  renderProductPage,
  createOrder,
  confirmPayment,
};
