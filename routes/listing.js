const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const Booking = require("../models/booking.js");
const {
  isLoggedIn,
  isOwner,
  validateListing,
  saveRedirectUrl,
} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//using router.route

router
  .route("/")
  .get(wrapAsync(listingController.index)) //index route
  .post(
    //create route
    isLoggedIn(),
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//search route
router.get("/search",wrapAsync(async(req,res)=>{
  let {place} = req.query;
  let placeListings  = await Listing.find({country : place});
  res.render("listings/search.ejs",{placeListings});
}));

//new route
router.get("/new", isLoggedIn(), listingController.renderNewForm);

router
  .route("/:id")
  .get(saveRedirectUrl, wrapAsync(listingController.showListing)) //show route
  .put(
    //update route
    isLoggedIn(),
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(isLoggedIn(), isOwner, wrapAsync(listingController.destroyListing)); //delete route

//trending route
router.get(
  "/category/Trending",
  wrapAsync(async (req, res) => {
    let bookings = await Booking.find({}).populate("listing");
    const unique = [];
    const seen = new Set();

    for (let item of bookings) {
      if (!seen.has(item.listing)) {
        seen.add(item.listing);
        unique.push(item.listing);
      }
    } 
    console.log(unique);
    
    res.render("listings/trending.ejs",{unique});
  })
);

//catergory route
router.get(
  "/category/:category",
  wrapAsync(async (req, res) => {
    let { category } = req.params;
    let listings = await Listing.find({ category });
    if (listings.length == 0) {
      return res.redirect("/listings");
    }
    res.render("listings/category.ejs", { listings });
  })
);

//Edit route
router.get(
  "/:id/edit",
  isLoggedIn(),
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

module.exports = router;

//or

// //Index route
// router.get("/", wrapAsync(listingController.index));

// //New route
// router.get("/new", isLoggedIn, listingController.renderNewForm);

// //show route
// router.get("/:id", wrapAsync(listingController.showListing));

// //create route
// router.post(
//   "/",
//   isLoggedIn,
//   validateListing,
//   wrapAsync(listingController.createListing)
// );

// //Edit route
// router.get(
//   "/:id/edit",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.renderEditForm)
// );

// //update route
// router.put(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   validateListing,
//   wrapAsync(listingController.updateListing)
// );

// //destyroy or delete route
// router.delete(
//   "/:id",
//   isLoggedIn,
//   isOwner,
//   wrapAsync(listingController.destroyListing)
// );

// module.exports = router;
