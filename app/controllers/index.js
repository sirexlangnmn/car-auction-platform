
const controller = {};

controller.registration = require('./registration.controller.js');
controller.login = require('./login.controller.js');
controller.cars = require('./cars.controller.js');
controller.ecdc = require('./ecdc.controller.js');


module.exports = controller;
