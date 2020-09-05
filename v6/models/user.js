const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// User schema setup
const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

module.exports = User;