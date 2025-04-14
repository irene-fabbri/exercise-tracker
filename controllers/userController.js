const Users = require('../models/Users');

class UserController {

    static async createUser(req, res, next) {
        const { username } = req.body;

        try {
            const user = await Users.create(username);
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

module.exports = UserController;