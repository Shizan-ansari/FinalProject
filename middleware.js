require("dotenv").config();
const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

const GLOBAL_ADMIN_ID = process.env.GLOBAL_ADMIN_ID; 


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("Error","You Must be logged In !");
        return res.redirect("/login");
    }
    next();

};
// admin middleware
module.exports.isAdmin = (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.role === "admin" || req.user._id.toString() === GLOBAL_ADMIN_ID)
  ) {
    return next();
  }
  req.flash("error", "You must be an admin to view this page.");
  return res.redirect("/login");
};




module.exports.saveRedirectUrl = (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isOwnerOrGlobalAdmin = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  // check if user is owner OR global admin
  if (
    listing.owner.equals(req.user._id) ||
    req.user._id.toString() === GLOBAL_ADMIN_ID
  ) {
    return next();
  }

  req.flash("error", "You don't have permission to do that!");
  return res.redirect(`/listings/${id}`);
};

//joi validation schema function as a middleware
module.exports.validateListing = (req,res,next) =>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else{
        next();
    }
}

//joi validation review schema function as a middleware
module.exports.validateReview = (req,res,next) =>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
       throw new ExpressError(400, errMsg);
    } else{
        next();
    }
};

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;

  const review = await Review.findById(reviewId);
  const listing = await Listing.findById(id);

  if (!review || !listing) {
    req.flash("error", "Review or listing not found");
    return res.redirect(`/listings/${id}`);
  }

  const isAuthor = review.author.equals(res.locals.currUser._id);
  const isListingOwner = listing.owner.equals(res.locals.currUser._id);
  const isGlobalAdmin =
    res.locals.currUser._id.toString() === process.env.GLOBAL_ADMIN_ID;

  if (isAuthor || isListingOwner || isGlobalAdmin) {
    return next();
  }

  req.flash("error", "You don't have permission to do that");
  return res.redirect(`/listings/${id}`);
};


