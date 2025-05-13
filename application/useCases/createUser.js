import { User } from '../../domain/User.js';
import { UserUseCaseError } from '../applicationErrors.js';

class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(user) {
        let newUser;
        try {
            newUser = new User(user.username, user.userId);
        }
        catch (error) {
            console.error('Invalid user data', error);
            throw new UserUseCaseError('Invalid user data', { cause: error });
        }
        try {
            const savedUser = await this.userRepository.create(user);
            return savedUser;
        }
        catch (error) {
            console.error('User creation failed:', error);
            throw new UserUseCaseError('Error creating user', { cause:error });
        }
    }
};
export { CreateUserService };