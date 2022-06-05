
exports.init = function(io) {

  const chat = io
      .of('/chat')
      .on('connection', (socket) => {
        try{
          socket.on('create or join', (room, userId) => {
            socket.join(room);
            chat.to(room).emit('joined', room, userId);
          });

          socket.on('chat', (room, userId, chatText) => {
            chat.to(room).emit('chat', room, userId, chatText);
          });

          socket.on('disconnect', () => {
            console.log('Disconnected');
          });

          socket.on('drawing', function (room, userId, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness) {
                chat.to(room).emit('drawing', room, userId, canvasWidth, canvasHeight, prevX, prevY, currX, currY, color, thickness)
          });

        } catch (e) {

        }
      });
  /*io.sockets.on('connection', function (socket) {
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
  });*/
}
