const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");

const userController = require("../controllers/users.js");

router.get(
  "/user/:id",
  isLoggedIn(),
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let reviews = await Review.find({ author: id });
    let reviewIds = reviews.map((r) => r._id);
    let reviewListings = await Listing.find({ reviews: { $in: reviewIds } });
    let listings = await Listing.find({ owner: id });
    let userBookings = await Booking.find({user : id}).populate("listing");

    res.render("users/user.ejs", { reviews, listings, reviewListings,userBookings });
  })
);

router.post(
  "/user/booking/:id",
  isLoggedIn("you must be logged in to make a booking"),
  wrapAsync(async (req, res) => {
    const { id } = req.params;

    const listingId = await Listing.findById(id);
    const listingPrice = listingId.price;

    const bookingData = req.body.booking;
    const checkIn = new Date(bookingData.CheckIn);
    const checkOut = new Date(bookingData.CheckOut);

    let days = 1; // Default nights
    if (checkOut > checkIn) {
      const timeDiff = checkOut - checkIn;
      days = timeDiff / (1000 * 60 * 60 * 24); // Convert ms to days
    }

    const finalPrice = days * listingPrice;

    const newBooking = new Booking({
      user: req.user._id,
      listing: id,
      adults: bookingData.Adults,
      children: bookingData.Children,
      days: days,
      price: finalPrice,
    });
    let savedBooking = await newBooking.save();
    console.log(savedBooking);
    req.flash("success","Congrats Booking Confirmed");
    res.redirect(`/listings/${id}`);
  })
);

router.delete("/user/booking/delete/:id",wrapAsync(async(req,res)=>{
  let {id} = req.params;
  let cancelBooking = await Booking.findByIdAndDelete(id);
  console.log(cancelBooking);
  let userId = res.locals.currUser.id;
  req.flash("success" , "Your Booking Cancelled")
  res.redirect("/listings");

}))

router.get("/signup", userController.renderSignupForm);

router.post("/signup", wrapAsync(userController.signup));

//or

// router
//   .route("/signup")
//   .get(userController.renderSignupForm)
//   .post(wrapAsync(userController.signup));

router.get("/login", userController.renderLoginForm);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userController.login
);

//or

// router
//   .route("login")
//   .get(userController.renderLoginForm)
//   .post(
//     saveRedirectUrl,
//     passport.authenticate("local", {
//       failureRedirect: "/login",
//       failureFlash: true,
//     }),
//     userController.login
//   );

router.get("/logout", userController.logout);

module.exports = router;
