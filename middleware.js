let Listing = require("./models/listing.js");
let Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const wrapAsync = require("./utils/wrapAsync.js");

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;//session coz accessible everyehere
        req.flash("error", "you must be logged in to create listing");
        return res.redirect("/login");//res.render("/users/login.ejs") also usable
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    let {id} = req.params;//find verify then update        //deconst and pass as an object 
    let listing = await Listing.findById(id);//or can write {...req.body.listing}
    console.log(res.locals.currUser);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);//return must
    }
    next();
};


module.exports.validateListing = (req, res, next)=>{
    let { error } = listingSchema.validate(req.body);//validate req.body
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
        let { error } = reviewSchema.validate(req.body);//validate req.body
        if(error){
            let errMsg = error.details.map((el)=>el.message).join(",");
            throw new ExpressError(400, errMsg);
        }else{
            next();
        }
};

module.exports.isReviewAuthor = wrapAsync(async (req, res, next) => {
    let {id, reviewId} = req.params;//find verify then update        //deconst and pass as an object 
    let review = await Review.findById(reviewId);//or can write {...req.body.listing}
    console.log(res.locals.currUser);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the author of this review");
        return res.redirect(`/listings/${id}`);//return must
    }
    next();
});

// When a JavaScript file becomes an Express.js application (a server-side framework for Node.js), it logs information to the console of the terminal or command prompt where the Node.js application is running, not the browser's console.