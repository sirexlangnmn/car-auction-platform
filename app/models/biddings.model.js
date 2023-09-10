module.exports = (sequelize, Sequelize) => {
  // comment
  // type = type of car
  //
  // status
  //    1 = open for bid
  //    2 = close
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
