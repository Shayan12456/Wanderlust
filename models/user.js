const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
});

userSchema.plugin(passportLocalMongoose);

module.exports = new mongoose.model("User", userSchema);

// Yes, passport-local-mongoose does hash the salted password. When a user registers or updates their password, the package generates a random salt, combines it with the user's provided password, and then hashes the salted password. The hashed password, along with the salt, is stored in the database. 