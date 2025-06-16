const formatExerciseResponse = (exercise, user) => ({
    username: user.username.value,
    description: exercise.description.value,
    duration: exercise.duration.value,
    date: exercise.date.value.toDateString(),
    _id: user.id.value,
});
const formatLogsResponse = (user, logs) => ({
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
