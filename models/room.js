const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        unique: true,
        required: true
    },
    creator: {
        type: String,
        default : 'NoName'
    },
    history: {
        type: Array,
        default: []
    },
    created: {
        type: Date,
        default: Date.now
    }
});

exports.Room = mongoose.model('Room', schema);