const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.index = async(req, res)=>{
    const listings = await Listing.find({});
    res.render("listings/index.ejs", {listings});
}

module.exports.renderNewForm =  (req, res)=>{
    // console.log(req.user);
    // if(!req.isAuthenticated()){
    //     req.flash("error", "you must be logged in to create listing");
    //     return res.redirect("/login");
    // }
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res, next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path:"reviews",
         populate:{path:"author"
        },})
        .populate({path:"owner"});
        // populate({
        // path:"reviews",
        // populate:"author"
    //    })
    if(!listing){//if if along with try catch because it is not potentailly an error in js, yeah error in ejs
        
        // return next(new ExpressError(500, "Listing not found!"));//but still an async error
        //if no return  so will encounter an error beacuse res.send not inside else
        // Or
        //flash error not handling with JOI here.
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }//if no return  so will encounter an error beacuse res.send not inside else
    // console.log(req.user);
    res.render("listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next)=>{
    // let {properties to destruct object} = req.body; //if not making listing object
    // if(!req.body.listing){
    //     throw new ExpressError(400, "Send valid data for listing.")
    // } 
    const newListing =  new Listing(req.body.listing);
    console.log(req.body.listing);
    // if(!newListing.title){ title not found
        // throw new ExpressError(400, "Send valid data for listing.")
    // const listing = req.body.listing;
    // console.log(req.body);
    //req.user stores username id and emails
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send();
    
    let url = req.file.path;
    let filename =  req.file.filename;
    newListing.owner = req.user._id;//current user's info
    newListing.image = {
        url,
        filename
    };
    newListing.geometry = response.body.features[0].geometry;
    // res.send(req.body);
    await newListing.save();//mongoose error is detected here
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res)=>{
    // if(!req.body.listing){
        // throw new ExpressError(400, "Send valid data for listing.")
    // }
    let {id} = req.params;
    let lisitng = await Listing.findByIdAndUpdate(id, {...req.body.listing});
    console.log(typeof req.file);
    if(typeof req.file !== "undefined"){//only typeof req.file not work coz it returns string we need to compare that is why
        console.log("Hi");
        let url = req.file.path;
        let filename =  req.file.filename;
        listing.image = {
            url,
            filename
        }
        await listing.save();
    }
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.category = async (req, res)=>{
    let {category} = req.params;
    // console.log(category);
    let listings = await Listing.find({category: category});
    res.render("listings/index.ejs", {listings});
};

module.exports.filter = async (req, res)=>{
    let {title} = req.body;
    console.log(title);
    let listings = await Listing.find({title: title});
    console.log(listings);
    res.render("listings/index.ejs", {listings});
}