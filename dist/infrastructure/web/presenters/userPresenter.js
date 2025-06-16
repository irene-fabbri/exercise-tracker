const formatUserResponse = (user) => ({
    username: user.username,
    _id: user.id.value,
});
const formatUserList = (userList) => userList.map((user) => formatUserResponse(user));
export { formatUserResponse, formatUserList };
