const express = require('express');
const session = require('express-session');
const passport = require('passport');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const User = require('./models/user');
const cors = require('cors');
const request = require('request');
const querystring = require('query-string');
require('dotenv').config();

var url = process.env.DATABASEURL || 'mongodb://localhost/updated_kym';
mongoose.connect(url, { useNewUrlParser: true });
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: false
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

app.get(
	'/login',
	passport.authenticate('spotify', {
		scope: [ 'user-read-email', 'user-read-private', 'user-top-read' ],
		showDialog: true
	})
);

app.get('/login_again', (req, res) => {
	res.send('login again');
});

app.get('/callback', passport.authenticate('spotify', { failureRedirect: '/login_again' }), (req, res, next) => {
	res.redirect('http://localhost:3000/#' + JSON.stringify(req.user));
	console.log('authentication successful');
});

const port = process.env.PORT || 3005;
app.listen(port, () => {
	console.log('Server up and running on port 3005!');
});
