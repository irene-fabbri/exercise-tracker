import { User } from '../../domain/User.js';
import { UserUseCaseError } from '../applicationErrors.js';

class FindAllUsersService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute() {
        try {
            const result = await this.userRepository.findAll();
            const resultMap = result.map(row => new User(row.username, row.userId));
            return resultMap;
        }
        catch (error) {
            console.error('User findAll failed:', error);
            throw new UserUseCaseError('Error finding all users', { cause:error });
        }
    }
};
export { FindAllUsersService };