const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Listing = require("./listing.js");
const User = require("./user.js");

const bookingSchema = new Schema({
  user : {
    type : Schema.Types.ObjectId,
    ref : "User",
  },
  listing: { type: Schema.Types.ObjectId, ref: "Listing" },
  days:{
    type : Number,
  },
  adults : {
    type : Number,
  },
  children : {
    type : Number,
  },
  price : {
    type : Number,
  }
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
