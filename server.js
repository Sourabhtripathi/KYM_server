const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const OpenPlaylist = require('./models/openPlaylist');
const cors = require('cors');
const request = require('request');
const querystring = require('query-string');
require('dotenv').config();

var url = process.env.DATABASEURL || 'mongodb://localhost/updated_kym';
mongoose.connect(url, { useNewUrlParser: true });
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

require('./passport')(passport);
app.get('/', (req, res) => {
	res.send(data);
});

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

app.get(
	'/login',
	passport.authenticate('spotify', {
		scope: [ 'user-read-email', 'user-read-private', 'user-top-read' ],
		showDialog: true
	})
);

app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login_again' }), (req, res, next) => {
	res.redirect('http://localhost:3000/#' + JSON.stringify(req.user));
	console.log('authentication successful');
});

app.get('/refresh_token', (req, res) => {
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
			'http://localhost:3000/#' +
				JSON.stringify({
					accessToken: access_token
				})
		);
	});
});

app.put('/setTopTracks', (req, res) => {
	console.log(req.body);
	User.findOneAndUpdate(
		req.params.spotifyId,
		{
			topTracks: req.body.topTracks
		},
		(err, updatedUser) => {
			if (err) {
				console.log(err);
			} else {
				console.log(updatedUser);
				res.send(updatedUser);
			}
		}
	);
});

// OpenPlaylists routes

// Create
app.post('/add_open_playlist', (req, res) => {
	// console.log(req);
	OpenPlaylist.create(req.body, (err, openPlaylist) => {
		if (err) {
			console.log(err);
		} else {
			console.log(openPlaylist);
			res.send(openPlaylist);
		}
	});
});

// Read
app.get('/open_playlists', (req, res) => {
	// console.log(req);
	OpenPlaylist.find({}, (err, openPlaylists) => {
		if (err) {
			console.log(err);
		} else {
			console.log(openPlaylists);
			res.send(openPlaylists);
		}
	});
});

// Delete
app.delete('/remove_open_playlist/:pid', (req, res) => {
	// console.log(req);
	OpenPlaylist.findOneAndRemove({ playlistId: req.params.pid }, (err) => {
		if (err) {
			console.log(err);
		} else {
			res.send('removed : ' + req.params.pid);
		}
	});
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log('Server up and running on port 3005!');
});
