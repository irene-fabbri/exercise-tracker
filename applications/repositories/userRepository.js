// Abstract User Repository
import { RepositoryError } from '../applicationErrors.js';
import { isAsyncronous } from '../utils.js'

class UserRepository {
    constructor() {
        if ( new.target === UserRepository ) {
            throw new RepositoryError('UserRepository class is of abstract type and cannot be instantiated');
        };

        const requiredMethods = ['create', 'getUserById', 'findAll'];

        for (const method of requiredMethods ) {
            if (typeof this[method] !== 'function') {
                throw new RepositoryError(`${method} method not implemented in UserRepository subclass`);
            };
            
            if ( !isAsyncronous(this[method]) ) {
                throw new RepositoryError(`${method} must be an async function`);
            };
        };
    }

    async create(username) { 
        throw new RepositoryError('create method not implemented for the Exercise Repository');
    }

    async getUserById(userId) {
        throw new RepositoryError('getUserById method not implemented');
    }

    async findAll() {
        throw new RepositoryError('findAll method not implemented');
    }
}

export { UserRepository };