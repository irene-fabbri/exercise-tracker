import { NoUsersFoundError } from "../applicationErrors.js";
import { UserRepository } from "../repositories/userRepository.js";

class FindAllUsersService {
  constructor(private userRepository: UserRepository) {}

  async execute() {
    const userList = await this.userRepository.findAll();
    if (!userList) {
      throw new NoUsersFoundError();
    }
    return userList;
  }
}
export { FindAllUsersService };
