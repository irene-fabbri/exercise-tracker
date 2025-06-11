import { UserAlreadyExists } from "../../application/applicationErrors.js";
import { AccountId, GymBud } from "../../domain/User.js";
import { Username } from "../../domain/Username.js";
import { UserRepository } from "../repositories/userRepository.js";

class CreateUserService {
  constructor(private userRepository: UserRepository) {}

  async execute(usernameAsString: string): Promise<GymBud> {
    const username: Username = new Username(usernameAsString);
    const existingUser = await this.userRepository.findByUsername(username);

    if (existingUser) {
      throw new UserAlreadyExists(username.value);
    }

    const userId = AccountId.create();
    const newUser = new GymBud(userId, username);
    await this.userRepository.create(newUser);
    return newUser;
  }
}
export { CreateUserService };
