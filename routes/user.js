const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

const userController = require("../controllers/users.js");

router.get(
  "/user/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let reviews = await Review.find({ author: id});
    let reviewIds = reviews.map(r => r._id);
    let reviewListings = await Listing.find({reviews : {$in : reviewIds}});
    let listings = await Listing.find({ owner: id});
     
    res.render("users/user.ejs", { reviews, listings, reviewListings});
  })
);

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
