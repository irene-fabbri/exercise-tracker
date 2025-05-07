import { User } from '../../domain/User.js';
import { UserUseCaseError } from '../applicationErrors.js';

class FindAllUsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        try {
            const userList = await this.userRepository.findAll();
            return userList;
        }
        catch (error) {
            console.error('User findAll failed:', error);
            throw new UserUseCaseError('Error finding all users', { cause:error });
        }
    }
};
export { FindAllUsersService };