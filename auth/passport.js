const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
//const BasicStrategy = require('passport-http').BasicStrategy;
const log = require('../libs/log')(module);
const config = require('../config');

const User = require('../models/user');
const Client = require('../models/client');
const AccessToken = require('../models/accessToken');

passport.use(new LocalStrategy({
	usernameField: 'client_id',
	passwordField: 'client_secret'
}, (username, password, done) => {
	log.info(username);
	debugger;
	Client.findOne({ clientId: username }, (err, client) => {
		debugger;
		if (err) {
			log.error(err.message);
			return done(err);
		}
		if (!client) {
			return done(null, false, { message: 'Incorrect clientId.' });
		}
		if (!client.checkClientSecret(password)) {
			return done(null, false, { message: 'Incorrect clientSecret.' });
		}
		debugger;
		return done(null, client);
	});
	debugger;
}));

passport.use(new BearerStrategy((tokenValue, done) => {
	AccessToken.findOne({token: tokenValue}, (err, token) => {
		if (err) {
			log.error(err.message);
			return done(err);
		}
		if (!token) {
			return done(null, false, { message: 'Incorrect token.' });
		}
		log.info((Date.now() - token.created) / 1000);
		log.info(config.get('authorization:tokenLife'));
		if (Math.round((Date.now() - token.created) / 1000 ) > config.get('authorization:tokenLife')) {
			return done(null, false, { message: 'Token is expired.' });
		}
		User.findOne({viewerId: token.username}, (err, user) => {
			if (err) {
				log.error(err.message);
				return done(err);
			}
			if (!user) {
				return done(null, false, { message: 'Unknown user.' });
			}
			let info = { scope: '*' };
			done(null, user, info);
		});
	});
}));

passport.use(new ClientPasswordStrategy((clientId, clientSecret, done) => {
	debugger;
	log.info('oauth2');
	Client.findOne({ clientId: clientId }, (err, client) => {
		
		if (err) {
			return done(err);
		}
		if (!client) {
			return done(null, false, { message: 'Incorrect clientId.' });
		}
		if (!client.checkClientSecret(clientSecret)) {
			return done(null, false, { message: 'Incorrect clientSecret.' });
		}
		return done(null, client);
	});
}));

module.exports = passport;