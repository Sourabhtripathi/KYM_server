const mongoose = require('mongoose');

const openPlaylistsSchema = new mongoose.Schema({
	userId: String,
	playlistId: String,
	playlistName: String,
	ratedBy: [ String ],
	totalRating: Number,
	overallRating: Number
	// friends: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: 'User'
	// 	}
	// ]
});

module.exports = mongoose.model('OpenPlaylists', openPlaylistsSchema);
