const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

//checks login middleware

//console.log(req.user);
module.exports.isLoggedIn = (customMsg) => {
  return (req, res, next) => {
    if (!req.isAuthenticated()) {
      if (
        req.method === "POST" &&
        req.originalUrl.startsWith("/user/booking/")
      ) {
        const id = req.originalUrl.split("/").pop();
        req.session.redirectUrl = `/listings/${id}`;
      } else {
        req.session.redirectUrl = req.originalUrl;
      }
      req.flash(
        "error",
        customMsg || "you must be logged in to create listing"
      );
      return res.redirect("/login");
    }
    next();
  };
};

// module.exports.saveBookingInfo = (req,res,next)=>{
//   const {id} = req.body;
  
   
// }

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of this listing");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//func to validate listings
module.exports.validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//func to validate reviews
module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//isReviewAuthor checking the review owner so he can only delete the review
module.exports.isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (!review.author.equals(res.locals.currUser._id)) {
    req.flash("error", "You are not the author of this review");
    return res.redirect(`/listings/${id}`);
  }
  next();
};
