import { UserAlreadyExists } from "../../application/applicationErrors.js";
import { User } from "../../domain/User.js";
import { UserId } from "../../domain/UserId.js";
import { Username } from "../../domain/Username.js";
class CreateUserService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(usernameAsString) {
        const username = new Username(usernameAsString);
        const existingUser = await this.userRepository.findByUsername(username);
        if (existingUser) {
            throw new UserAlreadyExists(username.value);
        }
        const userId = UserId.generateFromUsername(username);
        const newUser = new User(userId, username);
        await this.userRepository.create(newUser);
        return newUser;
    }
}
export { CreateUserService };
