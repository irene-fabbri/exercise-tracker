import { Entity } from "../../domain/Entity.ts";
import { Identifier } from "../../domain/Identifier.ts";

export interface EntityRepository<T extends Entity> {
  store(entity: T): Promise<void>;
  delete(entity: T): Promise<void>;
  findById(id: Identifier, context?: Partial<T>): Promise<T | null>;
  findAll(context?: Partial<T>): Promise<T[] | null>;
  findByProperty<Value>(
    key: string,
    value: Value,
    context?: Partial<T>
  ): Promise<T[] | null>;
}
