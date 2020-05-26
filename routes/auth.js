const express = require('express');
const router = express.Router();
const passport = require('passport');
const { scope } = require('../variables');
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_url = process.env.CLIENT_URL || 'http://localhost:3000';
// const client_url = 'http://localhost:3000';
const request = require('request');

require('../passport')(passport);

router.get(
	'/login',
	passport.authenticate('spotify', {
		scope: scope,
		showDialog: true
	})
);

router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login_again' }), (req, res, next) => {
	res.redirect(client_url + '/#' + JSON.stringify(req.user));
});

router.get('/refresh_token', (req, res) => {
	// requesting access token from refresh token
	var refresh_token = req.query.refresh_token;
	var authOptions = {
		url: 'https://accounts.spotify.com/api/token',
		headers: { Authorization: 'Basic ' + new Buffer(client_id + ':' + client_secret).toString('base64') },
		form: {
			grant_type: 'refresh_token',
			refresh_token: refresh_token
		},
		json: true
	};

	request.post(authOptions, function(error, response, body) {
		var access_token = body.access_token;

		res.redirect(
			client_url +
				'/#' +
				JSON.stringify({
					accessToken: access_token
				})
		);
	});
});

module.exports = router;
