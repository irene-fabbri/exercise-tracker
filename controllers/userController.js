import { Users } from '../models/Users.js';
import { createError } from '../utils/createError.js';
import { createUserSchema } from '../validators/userValidator.js';

class UserController {

    static async createUser(req, res, next) {
        // Validate input. stripUnknown removes attribute in body that are not in the schema
        const { error, value: username } = createUserSchema.validate(req.body, {
            stripUnknown: true,
          });
        if (error) {
          // Send a custom error to the error middleware
          return next(createError(
            'Validation Error',
            400,
            'validation_error',
            'Invalid user data',
            error.details[0].message
          ));
        }

        try {
            const user = await Users.create(value.username);
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async getUserById(req, res, next) {
        const { userId } = req.params;

        try {
            const user = await Users.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            next(error);
        }
    }

    static async getAllUsers(req, res, next) {
        try {
            const users = await Users.findAll();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}

export { UserController };