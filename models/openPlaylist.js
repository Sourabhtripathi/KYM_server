const mongoose = require('mongoose');

const openPlaylistsSchema = new mongoose.Schema({
	userId: String,
	playlistId: String,
	rating: Number
	// friends: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: 'User'
	// 	}
	// ]
});

module.exports = mongoose.model('OpenPlaylists', openPlaylistsSchema);
