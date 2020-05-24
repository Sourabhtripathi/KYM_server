const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	spotifyId: String,
	topTracks: [ Object ],
	name: String,
	images: [
		{
			height: Number,
			url: String,
			width: Number
		}
	],
	openPlaylists: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'OpenPlaylist'
		}
	]
});

module.exports = mongoose.model('User', usersSchema);
