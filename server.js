const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const format_message = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, 'static/')));

const botname = 'CodeChat Bot';

//run when a client connects
io.on('connection', (socket) => {
  //welcome current user
  socket.emit('message', format_message(botname, 'Welcome to CodeChat!')); //to single client

  //broadcast when a user connects
  socket.broadcast.emit('message', format_message(botname, 'A user has joined the chat')); //to all clients except the one connecting

  //runs when client disconnects
  socket.on('disconnect', () => {
    io.emit('message', format_message(botname, 'A user has left the chat')); //to ALL clients
  });

  //listen for chat_message
  socket.on('chat_message', (msg) => {
    //emit to everybody
    io.emit('message', format_message('User', msg));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));