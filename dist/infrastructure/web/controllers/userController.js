import { formatUserList, formatUserResponse, } from "../presenters/userPresenter.js";
import { ValidationError } from "../HTTPErrors.js";
class UserController {
    createUserService;
    findAllUserService;
    constructor(createUserService, findAllUserService) {
        this.createUserService = createUserService;
        this.findAllUserService = findAllUserService;
    }
    async createUser(request, response, next) {
        try {
            if (!request.body || !request.body.username) {
                throw new ValidationError("Missing body or username attribute", "need a non-empty json body with a username property");
            }
            const username = request.body.username;
            const newUser = await this.createUserService.execute(username);
            const formatted = formatUserResponse(newUser);
            response.status(201).json(formatted);
        }
        catch (error) {
            // to catch unexpected errors
            next(error);
        }
    }
    async findAllUsers(request, response, next) {
        try {
            const userList = await this.findAllUserService.execute();
            const formatted = formatUserList(userList);
            response.status(200).json(formatted);
        }
        catch (error) {
            next(error);
        }
    }
}
export { UserController };
