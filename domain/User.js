const {
    InvalidUsernameError
} = require('./domainErrors');

class User {
    constructor( username ){
        this.username = this.#checkUsername(username);
    }
    
    #checkUsername(username) {
        if (! username) {
            throw new InvalidUsernameError('Username is required')
        }

        if ( typeof username !== 'string') {
            throw new InvalidUsernameError('Username MUST be a String')
        }

        const trimmedUsername = username.trim()
        if ( trimmedUsername.length < 3) {
            throw new InvalidUsernameError('Username must be at least 3 characters long, excluding empty trailing and ending spaces')
        }

        if ( trimmedUsername.length > 30) {
            throw new InvalidUsernameError('Username cannot be longer than 30 characters')
        }

        return trimmedUsername;
    }
}