module.exports = (app) => {
    const { check, validationResult } = require('express-validator');

    const controllers = require('../controllers');
    const middleware = require('../middleware');

    const registrationValidation = middleware.registrationValidation;
    const registrationController = controllers.registration;

    const loginValidation = middleware.loginValidation;
    const loginController = controllers.login;

    const carsValidation = middleware.carsValidation;
    const carsController = controllers.cars;

    const ecdcController = controllers.ecdc;

    app.post(
        ['/api/post/registration'],
        registrationValidation,
        registrationController.create,
    );

    app.post(['/api/post/login-process'], loginValidation, loginController.create);

    app.post(['/api/post/create-auction'], carsValidation, carsController.create);

    app.post(['/api/get/list-of-auctions'], carsController.findCars);

    app.post(['/api/get/check-ownership'], ecdcController.checkOwnership);

    app.post(['/api/get/bid-process'], carsController.bidProcess);

    app.post(['/api/get/bid-process-for-expired'], carsController.bidProcessForExpired);

    app.post(['/api/get/close-listing'], carsController.closeListing);
};
