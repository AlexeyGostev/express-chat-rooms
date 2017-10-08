const log = require('../libs/log.js')(module);
const HttpError = require('../errors').HttpError;


module.exports = function(server) {
    let io = require('socket.io')(server); // create ws
    io.set('origins', '*:3000');
    io.set('logger', log);

    io.on('connection', socket => {
        socket.on('addRoom', function(room) {
           socket.join(room);
        });

        socket.on('message', function(message){
            var rooms = Object.keys(socket.rooms);
            io.to(rooms[1]).emit('message', message);
            console.log(rooms);
        });
    });

    return io;
};