import { ExerciseDate } from "./ExerciseDate.js";
class Exercise {
    description;
    duration;
    date;
    constructor(description, duration, date = new ExerciseDate()) {
        this.description = description;
        this.duration = duration;
        this.date = date;
    }
}
export { Exercise };
