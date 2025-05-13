const formatUserResponse = (user) => ({
    username: user.username,
    _id: user.userId.toString(),
});
  
const formatUserList = (userList) =>
  userList.map(user => formatUserResponse(user));

export { formatUserResponse, formatUserList };