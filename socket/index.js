const log = require('../libs/log.js')(module);
//const HttpError = require('../errors').HttpError;
const AccessToken = require('../models/accessToken');
const User = require('../models/user');

function emitError(s, errorMessage, errorDescription) {
  s.emit('errors', {
    message: errorMessage,
    description: errorDescription
  })
}

module.exports = function(server) {
  const io = require('socket.io')(server); // create ws
  io.set('origins', '*:3000');
  io.set('logger', log);

  io.on('connection', socket => {
    socket.on('addUserFromRoom', (room) => {
      socket.join(room);
      log.info(socket.rooms);
    });

    socket.on('removeUserFromRoom', (room) => {
      socket.leave(room);
      log.info(socket.rooms);
    });

    socket.on('message', (accessToken, message, room) => {
      if (!socket.rooms.room) {
        emitError(socket, 'client error', 'socket has not subscribe this room');
        return;
      }
      AccessToken.findOne({token: accessToken}, (err, accessToken) => {
        if (err) {
          emitError(socket, 'server error', 'unknown server error');
          return;
        }
        if (!accessToken) {
          emitError(socket, 'client error', 'incorrect access token)');
          return;
        }
        User.findOne({viewerId : accessToken.username}, (err, user) => {
          if (err) {
            emitError(socket, 'server error', 'unknown server error');
            return;
          }
          if (!user) {
            emitError(socket, 'client error', 'incorrect access token)');
            return;
          }
          io.to(room).emit('message', {
            author: user.viewerId,
            message: message,
            date: Date.now()
          })
        });
      });
    });
  });

  return io;
};