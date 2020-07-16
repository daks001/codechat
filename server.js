const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const format_message = require('./utils/messages');
const {user_join, get_curr_user, user_leave, get_room_users} = require('./utils/user');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'static/')));

const botname = 'CodeChat Bot';

//run when a client connects
io.on('connection', (socket) => {
  socket.on('join_room', ({username, room}) => {
    const user = user_join(socket.id, username, room);

    socket.join(user.room);

    //welcome current user
    socket.emit('message', format_message(botname, 'Welcome to CodeChat!')); //to single client

    //broadcast when a user connects
    socket.broadcast.to(user.room).emit('message', format_message(botname, `${user.username} has joined the chat`)); //to all clients except the one connecting

    //send users and room info
    io.to(user.room).emit('room_users', {room: user.room, users: get_room_users(user.room)});
  });

  //listen for chat_message
  socket.on('chat_message', (msg) => {
    const user = get_curr_user(socket.id);

    //emit to everybody
    io.to(user.room).emit('message', format_message(user.username, msg));
  });

  //runs when client disconnects
  socket.on('disconnect', () => {
    const user = user_leave(socket.id);
    if (user) {
      io.to(user.room).emit('message', format_message(botname, `${user.username} has left the chat`)); //to ALL clients in the room

      //update users and room info
    io.to(user.room).emit('room_users', {room: user.room, users: get_room_users(user.room)});
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));