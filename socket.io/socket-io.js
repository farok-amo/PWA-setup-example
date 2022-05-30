
exports.init = function(io) {
  io.sockets.on('connection', function (socket) {
    try {
     // insert here your event
      socket.on('create or join', (room, userId) => {
        socket.join(room);
        io.sockets.to(room).emit('joined', room, userId);
      });

      socket.on('chat', (room, userId, chatText) => {
        io.sockets.to(room).emit('chat', room, userId, chatText);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected');
      });
    } catch (e) {

    }
  });
}
