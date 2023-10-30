const Review = require("../models/review.js");
const Listing = require("../models/listing.js")

module.exports.createReview = async (req, res)=>{
    // let {id} = req.params;
    // let listing = await Listing.findById(id);
    // or
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
                    //.save() is an async func
    await newReview.save();
    await listing.save();
                            //or req.params.id
    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async(req, res)=>{
    let {id, reviewId} = req.params;

    await Review.findByIdAndDelete(reviewId);
                               //remove id from reviews array
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
};