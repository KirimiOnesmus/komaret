export class ApiError extends Error{
    constructor(status, message, code = 'EEROR'){
        super(message);
        this.name ='ApiError';
        this.status = status;
        this.code = code;
        this.isOperational = true;
        Error.captureStackTrace?.(this, this.constructor);
    }
}

export default ApiError;