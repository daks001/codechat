const chat_form = document.getElementById('chat-form');
const chat_messages = document.querySelector('.chat-messages');

//get username and room name from URL
const {username, room} = Qs.parse(location.search, {
  ignoreQueryPrefix : true
});

const socket = io();

//join chatroom
socket.emit('join_room', {username, room});

//output message to dom
const output_message = (message) => {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
  document.querySelector('.chat-messages').appendChild(div);
};

//message from server
socket.on('message', message => {
  console.log(message);
  output_message(message);
  //scroll down
  chat_messages.scrollTop = chat_messages.scrollHeight;
});

//on sending a message
chat_form.addEventListener('submit', (e) => {
  e.preventDefault();
  //getting message text
  const msg = e.target.elements.msg.value;
  //emitting a message to the server
  socket.emit('chat_message', msg);
  //clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});