const formatExerciseResponse = (exercise, user) => ({
  username: user.username,
  description: exercise.description,
  duration: exercise.duration,
  date: exercise.date.toDateString(),
  _id: user.userId.toString(),
});

const formatLogsResponse = (user, logs) => ({
  username: user.username,
  count: logs.length,
  _id: user.userId.toString(),
  log: logs.map((log) => ({
    description: log.description,
    duration: log.duration,
    date: log.date.toDateString(),
  })),
});

export { formatExerciseResponse, formatLogsResponse };
