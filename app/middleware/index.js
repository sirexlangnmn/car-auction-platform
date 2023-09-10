
const middleware = {};
middleware.registrationValidation = require('./validations/registration.validation.js');
middleware.loginValidation = require('./validations/login.validation.js');
middleware.carsValidation = require('./validations/cars.validation.js');


module.exports = middleware;
