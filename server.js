const express = require('express');
const session = require('express-session');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
require('dotenv').config();

// DB Config
let url = process.env.DATABASEURL;

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });

// Passport config
passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

// App config
app.use(cors());
app.use(
	bodyParser.urlencoded({
		extended: true
	})
);
app.use(bodyParser.json());
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./routes'));

const port = process.env.PORT;
app.listen(port, () => {
	console.log(`Server up and running on port ${process.env.PORT}`);
});
