const mongoose = require('mongoose');

//campground schema setup
const commentSchema = new mongoose.Schema({
	text: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	}
});

//--use campgroundSchema, compiling schema into a model
const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
