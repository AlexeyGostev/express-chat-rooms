//const path = require('path');
const util = require('util');
const http = require('http');

function HttpError(status, message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);

    this.status = status;
    this.message = message || http.STATUS_CODES[status] || "Error";
}

util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

function AuthError(message) {
    Error.apply(this, arguments);
    Error.captureStackTrace(this, HttpError);
    this.message = message || http.STATUS_CODES[status] || "Auth Error";
}

util.inherits(AuthError, Error);
AuthError.prototype.name = 'AuthError';

exports.AuthError = AuthError;
exports.HttpError = HttpError;