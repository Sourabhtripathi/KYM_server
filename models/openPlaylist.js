const mongoose = require('mongoose');

const openPlaylistsSchema = new mongoose.Schema({
	userId: String,
	userName: String,
	playlistId: String,
	playlistName: String,
	ratedBy: [ String ],
	totalRating: Number,
	overallRating: Number,
	images: [
		{
			height: Number,
			url: String,
			width: Number
		}
	]
	// genres: [ String ]
	// friends: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: 'User'
	// 	}
	// ]
});

module.exports = mongoose.model('OpenPlaylists', openPlaylistsSchema);
