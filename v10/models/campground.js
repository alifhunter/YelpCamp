const mongoose = require('mongoose');

//campground schema setup
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User'
		},
		username: String
	},
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Comment'
		}
	]
});
//--use campgroundSchema, compiling schema into a model
const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;
