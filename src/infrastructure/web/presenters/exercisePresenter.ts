import { Exercise } from "../../../domain/Exercise.js";
import { GymBud } from "../../../domain/Account.ts";

const formatExerciseResponse = (exercise: Exercise, gymbud: GymBud) => ({
  username: gymbud.username.value,
  description: exercise.description.value,
  duration: exercise.duration.value,
  date: exercise.date.value.toDateString(),
  _id: gymbud.id.value,
});

const formatLogsResponse = (gymbud: GymBud, logs: Exercise[]) => ({
  username: gymbud.username.value,
  count: logs.length,
  _id: gymbud.id.value,
  log: logs.map((log) => ({
    description: log.description,
    duration: log.duration,
    date: log.date.value.toDateString(),
  })),
});

export { formatExerciseResponse, formatLogsResponse };
