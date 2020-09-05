const mongoose = require("mongoose");

//campground schema setup
const commentSchema = new mongoose.Schema({
    text: String,
    author: String
});

//--use campgroundSchema, compiling schema into a model
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;