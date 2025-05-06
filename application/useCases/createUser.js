import { User } from '../../domain/User.js';
import { UserUseCaseError } from '../applicationErrors.js';

class CreateUserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    #validate(user) {
        if (!user || !user.username) {
            throw new UserUseCaseError('Missing required fields: username.');
        };    
    }

    async execute(user) {
        this.#validate(user);

        let newUser;
        try {
            newUser = new User( user.username );    
        }
        catch (error) {
            console.error('Invalid user data', error);
            throw new UserUseCaseError('Invalid user data', { cause: error });
        }

        try {
            const result = await userRepository.create(newUser);
            return new User(result.username, result.userId);
        }
        catch (error) {
            console.error('User creation failed:', error);
            throw new UserUseCaseError('Error creating user', { cause:error });
        }
    }
};
export { CreateUserService };