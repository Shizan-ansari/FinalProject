  const express = require("express");
  const router = express.Router();
  const wrapAsync = require("../utils/wrapAsync.js");
  const Listing = require("../models/listing.js");
  const {isLoggedIn, isOwnerOrGlobalAdmin, validateListing} = require("../middleware.js");
  const Order = require("../models/order.js"); 



  const listingController = require("../controllers/listings.js");

  const multer = require("multer");
  const { storage } = require("../cloudConfig.js");
  const upload = multer({ storage });//multer hmari files ko cloudinary ki storage me save krdega 

// Admin route to show all bookings
// Admin route: Show only bookings for listings owned by the logged-in user
router.get("/admin", async (req, res) => {
  try {
    if (!req.user) {
      req.flash("error", "You must be logged in to access this page.");
      return res.redirect("/login");
    }

    let orders;

    // 🔹 If Global Admin, show ALL orders
    if (req.user._id.toString() === process.env.GLOBAL_ADMIN_ID.trim()) {
      console.log("Global Admin detected, fetching ALL orders...");
      orders = await Order.find({})
        .populate("listing")
        .populate("bookedBy");
    } else {
      // 🔹 Normal Admin: only see orders of their own listings
      console.log("Normal Admin detected, fetching OWN orders...");
      orders = await Order.find({})
        .populate({
          path: "listing",
          match: { owner: req.user._id }, // only listings owned by this admin
        })
        .populate("bookedBy");

      // remove orders with no matching listing
      orders = orders.filter(order => order.listing !== null);
    }

    res.render("listings/admin.ejs", { orders });
  } catch (err) {
    console.error(err);
    res.send("Error loading admin panel.");
  }
});




  //Index & Create route
  router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));


// GET /listings/search → filter by q, priceRange, dates
router.get("/search", async (req, res) => {
  try {
    const { q = "", checkIn, checkOut, priceRange } = req.query;

    const query = {};
    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    if (q.trim()) {
      query.$or = [
        { title: regex },
        { description: regex },
        { location: regex },
        { country: regex }
      ];
    }

    if (priceRange) {
      if (priceRange.includes("-")) {
        const [min, max] = priceRange.split("-").map(Number);
        query.price = { $gte: min, $lte: max };
      } else if (priceRange.endsWith("+")) {
        const min = Number(priceRange.replace("+", ""));
        query.price = { $gte: min };
      }
    }

    // 🔹 Date validations
    const today = new Date().setHours(0, 0, 0, 0);
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1); // allow only within 1 year
    const maxDateMs = maxDate.setHours(23, 59, 59, 999);

    if (checkIn) {
      const checkInDate = new Date(checkIn).setHours(0, 0, 0, 0);
      if (checkInDate < today) {
        req.flash("error", "❌ Check-in date cannot be in the past.");
        return res.redirect("/listings");
      }
      if (checkInDate > maxDateMs) {
        req.flash("error", "❌ Check-in date cannot be more than 1 year ahead.");
        return res.redirect("/listings");
      }
    }

    if (checkOut) {
      const checkOutDate = new Date(checkOut).setHours(0, 0, 0, 0);
      if (checkOutDate < today) {
        req.flash("error", "❌ Check-out date cannot be in the past.");
        return res.redirect("/listings");
      }
      if (checkOutDate > maxDateMs) {
        req.flash("error", "❌ Check-out date cannot be more than 1 year ahead.");
        return res.redirect("/listings");
      }
    }

    if (checkIn && checkOut) {
      if (new Date(checkOut) <= new Date(checkIn)) {
        req.flash("error", "⚠️ Check-out must be after check-in.");
        return res.redirect("/listings");
      }
    }

    // Listings
    let results = await Listing.find(query);

    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      const bookedOrders = await Order.find({
        $or: [
          { checkIn: { $lt: end }, checkOut: { $gt: start } }
        ]
      }).select("listing");

      const bookedListingIds = bookedOrders.map(o => o.listing.toString());

      results = results.filter(
        l => !bookedListingIds.includes(l._id.toString())
      );
    }

    res.render("listings/search.ejs", { 
      results, 
      q, 
      checkIn, 
      checkOut, 
      priceRange 
    });

  } catch (err) {
    console.error(err);
    req.flash("error", "🚨 Something went wrong while searching.");
    res.redirect("/listings");
  }
});




  //new route
  router.get("/new", isLoggedIn, listingController.renderNewForm);

  //show Route, Update route, Delete route
  router
  .route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(isLoggedIn,isOwnerOrGlobalAdmin, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
  .delete(isLoggedIn,isOwnerOrGlobalAdmin,wrapAsync(listingController.destroyListing));




  //edit route
  router.get("/:id/edit",isLoggedIn,isOwnerOrGlobalAdmin, wrapAsync(listingController.renderEditForm));


  module.exports = router;