import { createUserService } from '../../../config/dependencies.js';
import { findAllUsersService } from '../../../config/dependencies.js';
import { User } from '../../../domain/User.js';
import { ValidationError } from '../HTTPErrors.js';
import { formatUserList, formatUserResponse } from '../presenters/userPresenter.js';

class UserController {

    static async createUser(req, res, next) {
        // Validate input
        let newUser;
        try {
            newUser = new User(req.body.username);
        } catch (error) {
            console.error('Invalid user parameter', error)
            return next( new ValidationError('Invalid parameters: username', error.details?.[0]?.message || error.message, error) );
        }

        try {
            const savedUser = await createUserService.execute(newUser);
            const formatted = formatUserResponse(savedUser);
            res.status(201).json(formatted);
        } catch (error) {
            next(error);
        }
    }

    static async findAllUsers(req, res, next) {
        try {
            const userList = await findAllUsersService.execute();
            const formatted = formatUserList(userList);

            res.status(200).json(formatted);
        } catch (error) {
            next(error);
        }
    }
}

export { UserController };