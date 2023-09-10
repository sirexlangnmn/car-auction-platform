const { check, validationResult } = require('express-validator');

const validationMiddleware = [
    // check('companyBanner', 'S:Upload banner.').exists(),
    // check('companyLogo', 'S:Upload logo.').exists(),
    check('testName').not().isEmpty().withMessage('S: testName is required.').trim().escape(),
];

module.exports = validationMiddleware;
