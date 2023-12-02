if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
// const {listingSchema, reviewSchema} = require("./schema.js");
// const Review = require("./models/review.js");
const User = require("./models/user.js");

const listingRoute = require("./routes/listing.js");
const reviewRoute = require("./routes/review.js");
const userRoute = require("./routes/user.js");

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

const store =  MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,
});
store.on("error", (err)=>{
    console.log("ERROR in MONGO SESSION STORE", err);
})
// In many session management systems, when a session expires, the associated session information is typically removed or marked as invalid in the database. This is done to clean up expired sessions and free up resources. T
const sessionOptions = {
    // store:store
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
};

//ROOT ROUTE
// app.get("/", (req, res)=>{
//     res.send("Hi! I am root.");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());//passport
app.use(passport.session());//passport  
passport.use(new LocalStrategy(User.authenticate()));//passport-local-mongoose

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res)=>{
//     let fakeUser = new User({
//         email: "student@gmail.com",
//         username: "delta-student",
//     });

//     let registertedUser = await User.register(fakeUser, "helloworld");
//     res.send(registertedUser);
// });

app.use("/listings", listingRoute);
app.use("/listings/:id/reviews", reviewRoute);
app.use("/", userRoute);

//testListing route
// app.get("/testListing", async (req, res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });
app.all("*", (req, res, next)=>{
    // console.log("all triggered");
    next(new ExpressError(404, "Page not Found!"));
});
app.use((err, req, res, next)=>{
    
    // console.log(err.statusCode);//don't work if valueless because not default set for Err obj||   constructor(statusCode = 500, message) {
    let {statusCode=500, message="Something went Wrong!"} = err;
    // console.log(statusCode);
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
    // res.send("something went wrong!");
});
app.listen(8080, ()=>{
    console.log("server is listening on port 8080");
});
