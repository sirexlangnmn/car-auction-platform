const { check, validationResult } = require('express-validator');

const validationMiddleware = [
    check('carBrand').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
    check('year').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
    check('type').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
    check('openingPrice').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
    check('priceIncrement').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
    check('expiryDate').not().isEmpty().withMessage('S: Full Name is required.').trim().escape(),
];

module.exports = validationMiddleware;
