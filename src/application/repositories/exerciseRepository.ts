// Abstract Exercise Repository

import { Exercise } from "../../domain/Exercise.js";
import { AccountId, GymBud } from "../../domain/Account.ts";
import { Entity } from "../../domain/Entity.ts";
import { EntityRepository } from "./EntityRepository.ts";

interface ExerciseRepository extends EntityRepository<Exercise> {
  create(exercise: Exercise): Promise<void>;
  findByAccount(gymbud: GymBud): Promise<Exercise[] | null>;
}

export type { ExerciseRepository };
