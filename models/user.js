const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	spotifyId: String,
	topTracks: [ Object ],
	name: String,
	images: [ String ]
});

module.exports = mongoose.model('User', usersSchema);
