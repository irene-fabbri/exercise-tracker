import { NoUsersFoundError } from "../applicationErrors.js";
class FindAllUsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async execute() {
        const userList = await this.userRepository.findAll();
        if (!userList) {
            throw new NoUsersFoundError();
        }
        return userList;
    }
}
export { FindAllUsersService };
