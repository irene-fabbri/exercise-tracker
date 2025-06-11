import { Exercise } from "../../../domain/Exercise.js";
import { User } from "../../../domain/User.js";

const formatExerciseResponse = (exercise: Exercise, user: User) => ({
  username: user.username.value,
  description: exercise.description.value,
  duration: exercise.duration.value,
  date: exercise.date.value.toDateString(),
  _id: user.id.value,
});

const formatLogsResponse = (user: User, logs: Exercise[]) => ({
  username: user.username.value,
  count: logs.length,
  _id: user.id.value,
  log: logs.map((log) => ({
    description: log.description,
    duration: log.duration,
    date: log.date.value.toDateString(),
  })),
});

export { formatExerciseResponse, formatLogsResponse };
