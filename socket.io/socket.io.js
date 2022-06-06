
exports.init = function(io) {

    // the chat namespace
  const chat = io
      .of('/chat')
      .on('connection', (socket) => {
        try{
            /**
             * it creates or joins a room
             */
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

          socket.on('drawing', function (room, userId, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness) {
                chat.to(room).emit('drawing', room, userId, canvasWidth, canvasHeight, x1, y21, x2, y2, color, thickness)
          });

          socket.on('clear-canvas', function(room, userId) {
              chat.to(room).emit('Cleared canvas', room, userId);
          })

        } catch (e) {

        }
      });
}
