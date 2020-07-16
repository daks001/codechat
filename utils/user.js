const users = [];

//join user to chat
const user_join = (id, username, room) => {
  const user = {id, username, room};
  users.push(user);
  return user;
};

//get the current user
const get_curr_user = (id) => {
  return users.find(user => user.id === id);
};

//user leaves chat
const user_leave = (id) => {
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

//get room users
const get_room_users = (room) => {
  return users.filter(user => user.room === room);
}

module.exports = {
  user_join,
  get_curr_user,
  user_leave,
  get_room_users
};