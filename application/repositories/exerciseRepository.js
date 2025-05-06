// Abstract Exercise Repository

import { RepositoryError } from '../applicationErrors.js';
import { isAsyncronous } from '../utils.js'

class ExerciseRepository {

    constructor() {
        if ( new.target === ExerciseRepository ) {
            throw new RepositoryError('ExerciseRepository class is of abstract type and cannot be instantiated');
        };

        const requiredMethods = ['create', 'findByUser'];

        for (const method of requiredMethods ) {

            if (typeof this[method] !== 'function') {
                throw new RepositoryError(`${method} method not implemented in UserRepository subclass`);
            };
            
            if ( !isAsyncronous(this[method]) ) {
                throw new RepositoryError(`${method} must be an async function`);
            };
        }
    }
    
    create(exercise, userId) { 
        throw new RepositoryError('create method not implemented for the Exercise Repository');
    }

    findByUserId(userId) { 
        throw new RepositoryError('findByUserId method not implemented for the exercise Repository');
    }
}

export { ExerciseRepository };