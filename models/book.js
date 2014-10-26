var mongoose = require( 'mongoose' ),
	bookSchema = new mongoose.Schema({
		_id   : String,
		name  : String,
		author: String,
		rating: Number,
		genre : String,
		poster: String,
	});

module.exports = mongoose.model( 'book', bookSchema );