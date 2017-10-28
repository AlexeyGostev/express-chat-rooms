const crypto = require('crypto');

const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    clientName: {
        type: String,
        unique: true,
        required: true
    },
    hashedClientSecret: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    clientId: {
        type: String,
        unique: true,
        required: true
    },
});

schema.virtual('clientSecret')
    .set(function(clientSecret) {
        this._plainClientSecret = clientSecret;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedClientSecret = this.encryptClientSecret(clientSecret);
    })
    .get(function() { return this._plainClientSecret; });

schema.methods.encryptClientSecret = function(clientSecret) {
    return crypto.createHmac('sha1', this.salt).update(clientSecret).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

schema.methods.checkClientSecret = function(clientSecret) {
    return this.encryptClientSecret(clientSecret) === this.hashedClientSecret;
};

let Client = mongoose.model('Client', schema);
module.exports = Client;