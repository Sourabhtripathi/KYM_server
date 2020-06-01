const express = require('express');
const router = express.Router();
const passport = require('passport');
const { scope } = require('../variables');
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const client_url = process.env.CLIENT_URL;
const request = require('request');
const spotifyRequest = require('../spotifyRequest');
const CLIENT_CALLBACK_URL = `${process.env.CLIENT_URL}/callback`;
const CryptoJS = require('crypto-js');

require('../passport')(passport);

// web

router.get(
	'/login',
	passport.authenticate('spotify', {
		scope: scope,
		showDialog: true
	})
);

router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login_again' }), (req, res, next) => {
	res.redirect(client_url + '/#' + JSON.stringify(req.user));
	// res.send(JSON.stringify(req.user));
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
					access_token: access_token
				})
		);
		// res.send(
		// 	JSON.stringify({
		// 		access_token: access_token
		// 	})
		// );
	});
});

// android
// Route to obtain a new Token
router.post('/exchange', (req, res) => {
	const params = req.body;
	console.log(params);
	console.log('on exchange route');
	if (!params.code) {
		return res.json({
			error: 'Parameter missing'
		});
	}

	spotifyRequest({
		grant_type: 'authorization_code',
		redirect_uri: CLIENT_CALLBACK_URL,
		code: params.code
	})
		.then((session) => {
			let result = {
				access_token: session.access_token,
				expires_in: session.expires_in,
				refresh_token: encrypt(session.refresh_token)
			};
			return res.send(result);
		})
		.catch((response) => {
			return res.json(response);
		});
});

// Get a new access token from a refresh token
router.post('/refresh', (req, res) => {
	const params = req.body;
	if (!params.refresh_token) {
		return res.json({
			error: 'Parameter missing'
		});
	}

	spotifyRequest({
		grant_type: 'refresh_token',
		refresh_token: decrypt(params.refresh_token)
	})
		.then((session) => {
			return res.send({
				access_token: session.access_token,
				expires_in: session.expires_in
			});
		})
		.catch((response) => {
			return res.json(response);
		});
});

module.exports = router;

// Helper functions
function encrypt(text) {
	return CryptoJS.AES.encrypt(text, ENCRYPTION_SECRET).toString();
}

function decrypt(text) {
	var bytes = CryptoJS.AES.decrypt(text, ENCRYPTION_SECRET);
	return bytes.toString(CryptoJS.enc.Utf8);
}
