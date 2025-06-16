import { User } from "../../../domain/User.js";

const formatUserResponse = (user: User) => ({
  username: user.username,
  _id: user.id.value,
});

const formatUserList = (userList: User[]) =>
  userList.map((user) => formatUserResponse(user));

export { formatUserResponse, formatUserList };
