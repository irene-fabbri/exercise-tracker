import { NextFunction, Request, Response } from "express";
import { CreateUserService } from "../../../application/useCases/createUser.js";
import { FindAllUsersService } from "../../../application/useCases/findAllUsers.js";
import {
  formatUserList,
  formatUserResponse,
} from "../presenters/userPresenter.js";
import { ValidationError } from "../HTTPErrors.js";

class UserController {
  constructor(
    public createUserService: CreateUserService,
    public findAllUserService: FindAllUsersService
  ) {}

  async createUser(request: Request, response: Response, next: NextFunction) {
    try {
      if (!request.body || !request.body.username) {
        throw new ValidationError(
          "Missing body or username attribute",
          "need a non-empty json body with a username property"
        );
      }
      const username = request.body.username;
      const newUser = await this.createUserService.execute(username);
      const formatted = formatUserResponse(newUser);
      response.status(201).json(formatted);
    } catch (error) {
      // to catch unexpected errors
      next(error);
    }
  }

  async findAllUsers(request: Request, response: Response, next: NextFunction) {
    try {
      const userList = await this.findAllUserService.execute();
      const formatted = formatUserList(userList);
      response.status(200).json(formatted);
    } catch (error) {
      next(error);
    }
  }
}

export { UserController };
