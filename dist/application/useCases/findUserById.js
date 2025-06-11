import { UserId } from "../../domain/UserId.js";
import { UserNotFoundError } from "../applicationErrors.js";
class FindUserByIdService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute(id) {
        const userId = new UserId(id);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new UserNotFoundError(userId.value);
        }
        return user;
    }
}
export { FindUserByIdService };
