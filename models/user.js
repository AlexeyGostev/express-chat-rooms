const crypto = require('crypto');
const log = require('../libs/log.js')(module);

const HttpError = require('../errors').HttpError;
const AuthError = require('../errors').AuthError;
const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;


let schema = new Schema({
    viewerId: {
        type: String,
        unique: true,
        required: true
    },
    hashedAuthKey: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }
});

schema.methods.encryptPassword = function(authKey) {
    return crypto.createHmac('sha1', this.salt).update(authKey).digest('hex');
};

schema.virtual('authKey')
    .set(function(authKey) {
        this._plainPassword = authKey;
        this.salt = Math.random() + '';
        this.hashedAuthKey = this.encryptPassword(authKey);
    })
    .get(function() {
        return this._plainPassword;
    });

schema.methods.checkPassword = function(authKey) {
    return this.encryptPassword(authKey) === this.hashedAuthKey;
};

schema.statics.authorize = function(viewerId, authKey) {
    return new Promise(function(resolve, reject){
        let User = this;

        User.findOne( {viewerId: viewerId}, function(err, user) {
            if (err) return reject(err);

            if (user && user.checkPassword(authKey)) {
                return resolve(user);
            } else {
                reject(new AuthError('Неверный auth_key или viewerId'));
            }
        });
    });
};

schema.statics.register = function(viewerId, authKey) {
    return new Promise((resolve, reject) => {
        const User = this;

        User.findOne({viewerId : viewerId}, (err, oldUser) => {
            if (oldUser) {
                reject(new HttpError(400));
            } else {
                let user = new User({
                    viewerId: viewerId,
                    authKey: authKey
                });

                user.save((err, user) => {
                    if (err) reject(err);
                    if (user) resolve(user);
                });
            }
        });

    });
};

schema.statics.getUser = function(viewerId) {
    return new Promise((resolve, reject) => {
        const User = this;

        User.findOne({viewerId : viewerId}, (err, user) => {
            if (err) {
                log.error(err.message);
                reject(err);
            }
            resolve(user);
        });
    });
};

schema.statics.getUsers = function(options) {
    return new Promise((resolve, reject) => {
        const User = this;
        let search = {};

        for ( let el in options ) {
            if (options.hasOwnProperty(el)) {
                search[el] = options[el];
            }
        }
        User.find(search, (err, users) => {
            if (err) {
                log.error(err.message);
                reject(err);
            }
            resolve(users);
        });
    });
};

exports.User = mongoose.model('User', schema);