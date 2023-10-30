const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const multer = require("multer");
// const upload = multer({dest: "upload/"});
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});

const listingController = require("../controllers/listings.js");

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingController.createListing));
// .post(upload.single("listing[image]"), (req, res)=>{
//     res.send(req.file);
// });
//NEW ROUTE - before show route because in SHOW ROUTE the :id is supposing new as id also
//new is searched as ID in database
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Category Route
router.get("/type/:category", listingController.category);

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))
// //INDEX ROUTE   //index from whole file is used here 
// router.get("/", wrapAsync(listingController.index));

// //SHOW ROUTE 
// router.get("/:id", wrapAsync(listingController.showListing));

// //CREATE ROUTE  //incase hoppscotch //middleware as func
// router.post("/", isLoggedIn, validateListing, wrapAsync(listingController.createListing));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//Searh Route
router.post("/filtered", listingController.filter);
// // Update Route
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingController.updateListing));

// //DELETE ROUTE
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;