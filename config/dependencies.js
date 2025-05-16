// import DataBase
import { dbManager } from "../infrastructure/database/dbManager.js";
// Import user and exercise SQLite repositories
import { UserRepositorySQL } from "../infrastructure/repositories/userRepositorySQL.js";
import { ExerciseRepositorySQL } from "../infrastructure/repositories/exerciseRepositorySQL.js";

// Import services
import { CreateUserService } from "../application/useCases/createUser.js";
import { CreateExerciseService } from "../application/useCases/createExercise.js";
import { FindAllUsersService } from "../application/useCases/findAllUsers.js";
import { GetUserByIdService } from "../application/useCases/getUserById.js";
import { FindExerciseByUserIdService } from "../application/useCases/findExerciseByUser.js";

//Initialize database
await dbManager.initializeDatabase();

// Instantiate repository with database
const userRepository = new UserRepositorySQL();
const exerciseRepository = new ExerciseRepositorySQL();

// Inject into use cases
const createUserService = new CreateUserService(userRepository);
const createExerciseService = new CreateExerciseService(exerciseRepository);
const findExerciseByUserIdService = new FindExerciseByUserIdService(exerciseRepository);
const findAllUsersService = new FindAllUsersService(userRepository);
const getUserByIdService = new GetUserByIdService(userRepository);

// Export for controllers
export {
    createUserService,
    createExerciseService,
    findExerciseByUserIdService,
    findAllUsersService,
    getUserByIdService
};