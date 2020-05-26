const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.put('/setTopTracks', (req, res) => {
	User.findOneAndUpdate(
		req.params.spotifyId,
		{
			topTracks: req.body.topTracks
		},
		(err, updatedUser) => {
			if (err) {
				console.log(err);
			} else {
				res.send(updatedUser);
			}
		}
	);
});

// Read All Users

router.get('/users', (req, res) => {
	// console.log(req);
	User.find({}, (err, users) => {
		if (err) {
			console.log(err);
		} else {
			res.send(users);
		}
	});
});

module.exports = router;
