// import DataBase
import { dbManager } from "../infrastructure/database/dbManager.js";
// Import user and exercise SQLite repositories
import { UserRepositorySQL } from "../infrastructure/repositories/userRepositorySQL.js";
import { ExerciseRepositorySQL } from "../infrastructure/repositories/exerciseRepositorySQL.js";
// Import services
import { CreateUserService } from "../application/useCases/createUser.js";
import { CreateExerciseService } from "../application/useCases/createExercise.js";
import { FindAllUsersService } from "../application/useCases/findAllUsers.js";
import { FindUserByIdService } from "../application/useCases/findUserById.js";
import { FindExerciseByUserIdService } from "../application/useCases/findExerciseByUser.js";
import { UserController } from "../infrastructure/web/controllers/userController.js";
import { ExerciseController } from "../infrastructure/web/controllers/exerciseController.js";
let userController;
let exerciseController;
async function initializeDependencies() {
    //Initialize database
    await dbManager.initializeDatabase();
    // Instantiate repository with database
    const userRepository = new UserRepositorySQL();
    const exerciseRepository = new ExerciseRepositorySQL();
    // Inject into use cases
    const findAllUsersService = new FindAllUsersService(userRepository);
    const findUserByIdService = new FindUserByIdService(userRepository);
    const createUserService = new CreateUserService(userRepository);
    const createExerciseService = new CreateExerciseService(exerciseRepository, userRepository);
    const findExerciseByUserIdService = new FindExerciseByUserIdService(exerciseRepository);
    // Inject into controllers
    userController = new UserController(createUserService, findAllUsersService);
    exerciseController = new ExerciseController(createExerciseService, findUserByIdService, findExerciseByUserIdService);
}
// Export a function to get the initialized controllers
function getUserController() {
    if (!userController)
        throw new Error("Dependencies not initialized");
    return userController;
}
function getExerciseController() {
    if (!exerciseController)
        throw new Error("Dependencies not initialized");
    return exerciseController;
}
export { initializeDependencies, getUserController, getExerciseController };
