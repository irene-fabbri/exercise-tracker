import { Description } from "./Description.js";
import { Duration } from "./Duration.js";
import { ExerciseDate } from "./ExerciseDate.js";
import { Identifier } from "./Identifier.ts";
import { GymBud } from "./User.ts";

class ExerciseId extends Identifier {
  private constructor(value: string) {
    super(value);
  }
  // to create an exercise Identifier
  static create() {
    return new ExerciseId(Identifier.create().value);
  }
  // for exercise id read from databases
  static fromString(id: string) {
    return new ExerciseId(id);
  }
}

class Exercise {
  constructor(
    public readonly id: ExerciseId,
    public readonly description: Description,
    public readonly duration: Duration,
    public readonly gymbud: GymBud,
    public readonly date: ExerciseDate
  ) {}

  static create(
    description: string,
    duration: number,
    gymbud: GymBud,
    date: string | null = null
  ) {
    return new Exercise(
      ExerciseId.create(),
      new Description(description),
      new Duration(duration),
      gymbud,
      date ? ExerciseDate.fromString(date) : ExerciseDate.now()
    );
  }
}

export { Exercise, ExerciseId };
