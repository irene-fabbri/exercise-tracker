import { User } from '../../domain/User.js';
import { UserUseCaseError } from '../applicationErrors.js';

class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(username) {

        try {
            const user = new User( username );
            const savedUser = await userRepository.create(user);
            return savedUser;
        }
        catch (error) {
            console.error('User creation failed:', error);
            throw new UserUseCaseError('Error creating user', { cause:error });
        }
    }
};
export { CreateUserService };