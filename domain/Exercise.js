import { InvalidDescriptionError, InvalidDurationError, InvalidDateError } from './domainErrors.js';

class Exercise {
    constructor(description, duration, date = null){
        this.description = this.#checkDescription(description);
        this.duration = this.#checkDuration(duration);
        this.date = this.#checkDate(date);
    }
    
    #checkDescription(description) {
        if (! description) {
            throw new InvalidDescriptionError('Description is required')
        }

        if ( typeof description !== 'string') {
            throw new InvalidDescriptionError('Description MUST be a String')
        }

        const trimmedDescription = description.trim()
        if ( trimmedDescription.length < 1) {
            throw new InvalidDescriptionError('Description MUST be a non empty String having at least one character')
        }
        return trimmedDescription;
    }

    #checkDuration(duration) {
        if (! duration) {
            throw new InvalidDurationError('Duration is required');
        }

        if ( isNaN(duration) || ! Number.isInteger(duration)) {
            throw new InvalidDurationError('Invalid Duration: Duration MUST be an integer number (minutes)');
        }

        if ( duration <= 0) {
            throw new InvalidDurationError('Duration MUST be greater than zero');
        }
        return duration;
    }

    #checkDate(date) {
        const currentDate = new Date()
        if (! date) {
            return currentDate;
        }

        const parsedDate = Date.parse(date)
        if ( isNaN(parsedDate) ) {
            throw new InvalidDateError('Invalid Date format');
        }

        const exerciseDate = new Date(parsedDate);
        if( exerciseDate > currentDate ){
            throw new InvalidDateError('Date cannot be in the future');
        }
        return exerciseDate;
    }
}

export { Exercise };