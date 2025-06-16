import { NotFoundError, ValidationError } from "../HTTPErrors.js";
import { formatExerciseResponse, formatLogsResponse, } from "../presenters/exercisePresenter.js";
class ExerciseController {
    createExerciseService;
    findUserByIdService;
    findExerciseByUserIdService;
    constructor(createExerciseService, findUserByIdService, findExerciseByUserIdService) {
        this.createExerciseService = createExerciseService;
        this.findUserByIdService = findUserByIdService;
        this.findExerciseByUserIdService = findExerciseByUserIdService;
    }
    async createExercise(request, response, next) {
        try {
            if (!request.body ||
                !request.body.description ||
                !request.body.duration) {
                throw new ValidationError("Missing body or its description and duration attributes", "need a non-empty json body with description and duration properties");
            }
            const description = request.body.description;
            const duration = request.body.duration;
            const date = request.body.date || null;
            const userId = request.params.id;
            const user = await this.findUserByIdService.execute(userId);
            if (!user) {
                throw new NotFoundError(`No user found with id '${userId}'`);
            }
            const newExercise = await this.createExerciseService.execute(description, duration, date, userId);
            const formatted = formatExerciseResponse(newExercise, user);
            response.status(201).json(formatted);
        }
        catch (error) {
            // to catch unexpected errors
            next(error);
        }
    }
    async getLogs(request, response, next) {
        try {
            const userId = request.params.id;
            // find corrisponding user
            const user = await this.findUserByIdService.execute(userId);
            if (!user) {
                throw new NotFoundError(`No user found with id '${userId}'`);
            }
            const userLogs = await this.findExerciseByUserIdService.execute(userId);
            const formatted = formatLogsResponse(user, userLogs);
            response.status(200).json(formatted);
        }
        catch (error) {
            next(error);
        }
    }
}
export { ExerciseController };
