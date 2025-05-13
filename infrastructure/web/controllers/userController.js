import { CreateUserService } from '../../../application/useCases/createUser.js';
import { FindAllUsersService } from '../../../application/useCases/findAllUsers.js';
import { User } from '../../../domain/User.js';
import { formatUserResponse } from '../presenters/userPresenter.js';
import { createError } from '../utils/createError.js';

class UserController {

    static async createUser(req, res, next) {
        // Validate input
        let newUser;
        try {
            newUser = new User(req.body.username);
        } catch (error) {
            console.error('Invalid user parameter', error)
            return next(createError(
                'Invlid parameters: username',
                400,
                'validation_error',
                'Invalid username',
                error.details[0].message
              ));
        }

        try {
            const savedUser = await CreateUserService(newUser);
            const formatted = formatUserResponse(savedUser);
            res.status(201).json(formatted);
        } catch (error) {
            next(error);
        }
    }

    static async findAllUsers(req, res, next) {
        try {
            const userList = await FindAllUsersService.findAll();
            const formatted = formatUserList(userList);

            res.status(200).json(formatted);
        } catch (error) {
            next(error);
        }
    }
}

export { UserController };