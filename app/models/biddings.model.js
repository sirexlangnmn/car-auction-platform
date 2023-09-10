module.exports = (sequelize, Sequelize) => {
  const Biddings = sequelize.define('biddings', {
      car_uuid: {
          type: Sequelize.STRING,
      },
      user_uuid: {
          type: Sequelize.STRING,
      },
      price: {
          type: Sequelize.STRING,
      },
  });

  return Biddings;
};
