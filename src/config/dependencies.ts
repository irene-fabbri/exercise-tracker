// import DataBase
import { dbManager } from "../infrastructure/database/dbManager.js";
// Import user and exercise SQLite repositories
import { UserRepositorySQL } from "../infrastructure/repositories/userRepositorySQL.ts";
import { ExerciseRepositorySQL } from "../infrastructure/repositories/exerciseRepositorySQL.ts";
// Import services
import { CreateUserService } from "../application/useCases/createUser.ts";
import { CreateExerciseService } from "../application/useCases/createExercise.ts";
import { FindAllUsersService } from "../application/useCases/findAllUsers.ts";
import { FindUserByIdService } from "../application/useCases/findUserById.ts";
import { FindExerciseByUserIdService } from "../application/useCases/findExerciseByUser.ts";
import { UserController } from "../infrastructure/web/controllers/userController.ts";
import { ExerciseController } from "../infrastructure/web/controllers/exerciseController.ts";

let userController: UserController;
let exerciseController: ExerciseController;

async function initializeDependencies(): Promise<void> {
  //Initialize database
  await dbManager.initializeDatabase();

  // Instantiate repository with database
  const userRepository = new UserRepositorySQL();
  const exerciseRepository = new ExerciseRepositorySQL();

  // Inject into use cases
  const findAllUsersService = new FindAllUsersService(userRepository);
  const findUserByIdService = new FindUserByIdService(userRepository);
  const createUserService = new CreateUserService(userRepository);
  const createExerciseService = new CreateExerciseService(
    exerciseRepository,
    userRepository
  );
  const findExerciseByUserIdService = new FindExerciseByUserIdService(
    exerciseRepository
  );

  // Inject into controllers
  userController = new UserController(createUserService, findAllUsersService);
  exerciseController = new ExerciseController(
    createExerciseService,
    findUserByIdService,
    findExerciseByUserIdService
  );
}
// Export a function to get the initialized controllers
function getUserController(): UserController {
  if (!userController) throw new Error("Dependencies not initialized");
  return userController;
}

function getExerciseController(): ExerciseController {
  if (!exerciseController) throw new Error("Dependencies not initialized");
  return exerciseController;
}

export { initializeDependencies, getUserController, getExerciseController };
