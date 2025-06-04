const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

//func to validate listings
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

//Index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

//New route
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

//create route
router.post(
  "/",
  validateListing,
  wrapAsync(async (req, res) => {
    //let {title , description , image , price , country,location} = req.body;
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data listing");
    // }
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

//Edit route
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    console.log(listing);
    res.render("listings/edit.ejs", { listing });
  })
);

//update route
router.put(
  "/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data listing");
    // }
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//delete route
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

module.exports = router;
