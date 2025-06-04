const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
//const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./models/review.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

app.get("/", (req, res) => {
  res.send("Hi iam root");
});

//listings
app.use("/listings", listings);

//reviews
app.use("/listings/:id/reviews", reviews);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});

//the below code's purpose is just to understand it
// app.get("/testListing", async(req,res)=>{
//   let sampleListing = new Listing({
//     title : "My New Villa",
//     description : "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India"
//   });
//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successfull")
// })

// app.all("*", (req, res, next) => {
//   next(new ExpressError(404, "Page not found!"));
// });
