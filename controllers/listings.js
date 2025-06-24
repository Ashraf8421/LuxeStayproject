const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

//index route callback
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

//New form route callback
module.exports.renderNewForm = (req, res) => {
  //console.log(req.user);
  // if(!req.isAuthenticated()){
  //   req.flash("error","you must be logged in to create listing");
  //   return res.redirect("/login");
  // }
  res.render("listings/new.ejs");
};

//show route callback
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  console.log(listing);
  res.render("listings/show.ejs", { listing });
};

//post route callback
module.exports.createListing = async (req, res, next) => {
  //let {title , description , image , price , country,location} = req.body;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data listing");
  // }

  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);
  req.flash("success", "new listing created!");
  res.redirect("/listings");
};

//edit route callback
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  //console.log(listing);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }

  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

//update route callback
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data listing");
  // }

  // let listing = await Listing.findById(id);
  // if (!listing.owner.equals(res.locals.currUser._id)) {
  //   req.flash("error", "you dont have permission to edit");
  //   return res.redirect(`/listings/${id}`);
  // }//this code is declared as a middleware instead of writing this for every route
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${id}`);
};

//destroy or delete listing route callback
module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted");
  res.redirect("/listings");
};
