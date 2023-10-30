const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");
const { reviewSchema } = require("../schema");

const listingSchema = Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
        required: true
    },
    image:{
        // type: String,
        // default: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80",
        // set: (v) => v === ""?"https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80":v,
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
      category: {
        type: String,
        enum: ["Trending", "Rooms", "Iconic-Cities", "Mountains", "Castles", "Amazing-Pools", "Camping", "Farms", "Arctic", "Domes", "Boats"],
        required: true
      }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

//creating model from schema
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


// If the "location geometry" is not directly entered by the user but is determined or calculated by backend functions, you typically do not need to use Joi or other user input validation tools for that specific field, as there is no user-provided input to validate.