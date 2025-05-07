import { User } from '../../domain/User.js';
import { UserId } from '../../domain/UserId.js';
import { UserUseCaseError } from '../applicationErrors.js';

class GetUserByIdService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(id) {
        
        let userId;
        try {
            userId = new UserId(id);
        } catch (error) {
            console.error('Invalid user id', error)
            throw new UserUseCaseError('Invalid UserId', { cause: error });
        }

        try {
            const result = await this.userRepository.getUserById(id);
            return new User(result.username, result.userId);
        } catch (error) {
            console.error('User getUserById failed:', error);
            throw new UserUseCaseError('Error getting user by id', { cause: error });
        }
    }
};
export { GetUserByIdService };