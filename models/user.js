const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
	spotifyId: String,
	topTracks: [ Object ]
	// friends: [
	// 	{
	// 		type: mongoose.Schema.Types.ObjectId,
	// 		ref: 'User'
	// 	}
	// ]
});

module.exports = mongoose.model('User', usersSchema);
