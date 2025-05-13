const formatExerciseResponse = (exercise, username) => ({
    username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date.toDateString(),
    _id: exercise.userId.toString(),
});
  
const formatLogsResponse = (userId, username, logs) => ({
    username,
    count: logs.length,
    _id: userId.toString(),
    log: logs.map(log => ({
      description: log.description,
      duration: log.duration,
      date: log.date.toDateString(),
    }))
});
  
export { formatExerciseResponse, formatLogsResponse };