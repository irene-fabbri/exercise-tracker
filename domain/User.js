import { InvalidUsernameError } from './domainErrors.js';
import { UserId } from './UserId.js';

class User {
    constructor( username, userId = null){

        this.username = this.#checkUsername(username);
        this.userId = userId instanceof UserId
        ? userId
        : userId
            ? new UserId(userId)
            : UserId.generateFrom(this.username);
    }
    
    #checkUsername(username) {
        if (! username) {
            throw new InvalidUsernameError('Username is required');
        }

        if ( typeof username !== 'string') {
            throw new InvalidUsernameError('Username MUST be a String');
        }

        const trimmedUsername = username.trim();
        if ( trimmedUsername.length < 3) {
            throw new InvalidUsernameError('Username must be at least 3 characters long, excluding empty trailing and ending spaces');
        }

        if ( trimmedUsername.length > 30) {
            throw new InvalidUsernameError('Username cannot be longer than 30 characters');
        }

        return trimmedUsername;
    }

    #checkUserId(userId) {
        if ( !userId ) {
            return md5(`${this.username}${new Date().toString()}`);
        }

        const idPattern = /^[a-fA-F0-9]{32}$/;
        if (!idPattern.test(userId)) {
            throw new Error('Invalid ID: must be a valid MD5 hash');
        }
    }
}

export { User };