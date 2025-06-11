import { AccountId, User } from "../../domain/User.js";
import { UserNotFoundError } from "../applicationErrors.js";
import { UserRepository } from "../repositories/userRepository.js";

class FindUserByIdService {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    const userId = AccountId.fromString(id);
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId.value);
    }
    return user;
  }
}
export { FindUserByIdService };
