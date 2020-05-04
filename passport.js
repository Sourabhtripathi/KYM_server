const SpotifyStrategy = require('passport-spotify').Strategy;
const redirect_uri = 'http://localhost:3005/callback';
const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const jwt = require('jsonwebtoken');
const User = require('./models/user');

module.exports = (passport) => {
	passport.use(
		new SpotifyStrategy(
			{
				clientID: client_id,
				clientSecret: client_secret,
				callbackURL: redirect_uri
			},
			(accessToken, refreshToken, expires_in, profile, done) => {
				User.findOne({ spotifyId: profile.id }).then((user) => {
					if (!user) {
						const newUser = new User({
							id: profile.id
						});
						newUser.save();
					}
				});

				// asynchronous verification, for effect...
				process.nextTick(function() {
					// To keep the example simple, the user's spotify profile is returned to
					// represent the logged-in user. In a typical application, you would want
					// to associate the spotify account with a user record in your database,
					// and return that user instead.
					return done(null, accessToken);
				});
			}
		)
	);
};
