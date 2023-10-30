const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router
.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));
// router.get("/signup", userController.renderSignupForm);
// router.post("/signup", wrapAsync(userController.signup));

router
.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate( "local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login));
// router.get("/login", userController.renderLoginForm);
// router.post("/login", saveRedirectUrl, passport.authenticate( "local", {failureRedirect: "/login", failureFlash: true}), wrapAsync(userController.login));
//although we have written userController.login but in actual we have passport doing it. in controller there is code for what to do after login

router.get("/logout", userController.logout);

module.exports = router;

// In summary, the use of unique salts for each user is a fundamental practice in secure 