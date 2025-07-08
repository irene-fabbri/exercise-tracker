import { Identifier } from "./Identifier.ts";

export abstract class Entity {
  constructor(public readonly id: Identifier) {}
}
