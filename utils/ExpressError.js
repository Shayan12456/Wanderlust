class ExpressError extends Error {
    constructor(statusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;


// As of my last knowledge update in September 2021 and based on the ECMAScript specification (up to ES12), the built-in JavaScript Error class does not have a standard status or statusCode property. The Error class typically includes properties such as name and message to represent the name of the error and the associated error message. Any additional properties like status or statusCode would need to be added manually when creating custom error objects or extending the Error class.

// to set default
/* class ExpressError extends Error {
    constructor(statusCode = 500, message) {
        super();
        this.statusCode = statusCode;
        this.message = message || 'Internal Server Error';
    }
}

module.exports = ExpressError;
 */