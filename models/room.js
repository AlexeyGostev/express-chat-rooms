const mongoose = require('../libs/mongoose');
const Schema = mongoose.Schema;

let schema = new Schema({
    id: {
        type: String,
        unique: true,
        required: true
    },
    title: {
        type: String,
        unique: true,
        required: true
    },
    description : {
        type: String,
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

schema.static.createRoom = function(options) {
    return new Promise((resolve, reject) => {
        const Room = this;

        let room = new Room({
            id: options.id,
            title: options.title,
            description: options.description,
            creator: options.creator || 'NoName'
        });
        room.save((err, room) => {
            if (err) reject(err);
            if (room) resolve(room);
        });
    });
};

schema.static.editRoom = function(editRoom) {
    return new Promise((resolve, reject) => {
        const Room = this;
        let search = {};
        if (editRoom.id) {
            search.id = editRoom.id;
        } else if (editRoom.title){
            search.title = editRoom.title;
            } else {
                reject(new Error('Некорректный объект поиска'));
                }

        Room.findOne(search, (err, room) => {
            if (err) {
                log.error(err.message);
                reject(err);
            }

            for ( let el in editRoom) {
                if (editRoom.hasOwnProperty(el)) {
                    room[el] = editRoom[el];
                }
            }

            room.save((err, room) => {
                if (err) {
                    log.error(err.message);
                    reject(err);
                }
                resolve(room);
            });
        });
    });
};

schema.static.getRoom = function(id, title) {
    return new Promise((resolve, reject) => {
        const Room = this;
        let search = {};
        if (id) {
            search.id = id;
        } else if (title) {
            search.title = title;
            } else {
                reject(new Error('Некорректный объект поиска'));
                }

        Room.findOne(search, (err, room) => {
            if (err) {
                log.error(err.message);
                reject(err);
            }
            resolve(room);
        });
    });
};

schema.static.deleteRoom = function(id, title) {
    return new Promise((resolve, reject) => {
        const Room = this;
        let search = {};
        if (id) {
            search.id = id;
        } else if (title) {
            search.title = title;
            } else {
                reject(new Error('Некорректный объект поиска'));
                }
        Room.remove(search, (err, room) => {
            if (err) {
                log.error(err.message);
                reject(err);
            }
            resolve(room);
        });
    });
};


exports.Room = mongoose.model('Room', schema);