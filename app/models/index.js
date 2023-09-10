const dbConfig = require('../config/db.config.js');
const sequelizeConfig = require('../config/sequelize.config.js');

let Sequelize = sequelizeConfig.Sequelize;
let sequelize = sequelizeConfig.sequelize;

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require('./users.model.js')(sequelize, Sequelize);
db.users_accounts = require('./users_accounts.model.js')(sequelize, Sequelize);
db.cars = require('./cars.model.js')(sequelize, Sequelize);
db.biddings = require('./biddings.model.js')(sequelize, Sequelize);


module.exports = db;
