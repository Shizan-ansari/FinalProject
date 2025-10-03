const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const { isLoggedIn } = require("../middleware"); // ensure user is logged in
const order = require("../models/order");

//  Show orders for admin
router.get("/listings/admin", isLoggedIn, async (req, res) => {
    try {
        let orders;

        if (req.user.role === "admin" || req.user._id.toString() === process.env.GLOBAL_ADMIN_ID) {
            // Global admin → see ALL orders
            orders = await Order.find({})
                .populate("listing")
                .populate("bookedBy");
        } else {
            // Normal admin → only see their listing's orders
            orders = await Order.find({ bookedBy: req.user._id })
                .populate("listing")
                .populate("bookedBy");
        }

        // 🔥 remove orders where listing is missing (null)
        orders = orders.filter(order => order.listing !== null);

        res.render("listings/admin", { orders });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});


module.exports = router;
