const express = require('express');
const router = express.Router();
const User = require('../models/user');
const OpenPlaylist = require('../models/openPlaylist');

// Create
router.post('/add_open_playlist', (req, res) => {
	// console.log(req);
	const { userId, userName, playlistId, playlistName, overallRating, totalRating, ratedBy, images } = req.body;

	User.findOne({ spotifyId: req.body.userId }, (err, foundUser) => {
		const newOpenPlaylist = new OpenPlaylist({
			userId,
			userName,
			playlistId,
			playlistName,
			overallRating,
			totalRating,
			ratedBy,
			images,
			uId: foundUser
		});
		newOpenPlaylist.save((err, savedPlaylist) => {
			if (err) {
				console.log(err);
			} else {
				foundUser.openPlaylists.push(savedPlaylist);
				foundUser.save((err, data) => {
					if (err) {
						console.log(err);
					} else {
						console.log(data);
					}
				});
				res.send(savedPlaylist);
			}
		});
	});

	// OpenPlaylist.create(req.body, (err, openPlaylist) => {
	// 	if (err) {
	// 		console.log(err);
	// 	} else {
	// 		User.find({ spotifyId: req.body.userId }, (err, foundUser) => {
	// 			if (err) {
	// 				console.log(err);
	// 			} else {
	// 				console.log(foundUser);
	// 				foundUser.openPlaylists.push(openPlaylist);
	// 				foundUser.save((err, data) => {
	// 					if (err) {
	// 						console.log(err);
	// 					} else {
	// 						console.log(data);
	// 					}
	// 				});
	// 			}
	// 		});
	// 	}
	// });
});

// Read All

router.get('/open_playlists', (req, res) => {
	// console.log(req);
	OpenPlaylist.find({}, (err, openPlaylists) => {
		if (err) {
			console.log(err);
		} else {
			res.send(openPlaylists);
		}
	});
});

// Read One
router.get('/open_playlist/:pid', (req, res) => {
	// console.log(req);
	OpenPlaylist.find({ playlistId: req.params.pid }, (err, openPlaylists) => {
		if (err) {
			console.log(err);
			res.send({});
		} else {
			res.send(openPlaylists);
		}
	});
});

// Update
// add rating
router.put('/open_playlist/rate/:pid', (req, res) => {
	let { userId, rating } = req.body;
	rating = parseInt(rating);
	OpenPlaylist.findOne({ playlistId: req.params.pid }, (err, foundPlaylist) => {
		const total = foundPlaylist.totalRating;
		const overall = foundPlaylist.overallRating;
		foundPlaylist.ratedBy.push(userId);
		foundPlaylist.overallRating = (overall * total + rating) / (total + 1);
		foundPlaylist.totalRating += rating;
		foundPlaylist.save().then((data) => {
			res.send(data);
		});
	});
});

// Delete
router.delete('/remove_open_playlist/:pid', (req, res) => {
	OpenPlaylist.findOneAndRemove({ playlistId: req.params.pid }, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send('removed : ' + req.params.pid);
		}
	});
});
module.exports = router;
