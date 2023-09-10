module.exports = (sequelize, Sequelize) => {
  // comment
  // type = type of car
  //
  // status
  //    1 = open for bid
  //    2 = close by owner
  //    3 = already expired but someone still bid
  //    4 = close by admin
  const Cars = sequelize.define('cars', {
      brand: {
          type: Sequelize.STRING,
      },
      year: {
          type: Sequelize.STRING,
      },
      type: {
          type: Sequelize.STRING,
      },
      opening_price: {
          type: Sequelize.STRING,
      },
      price_increment: {
          type: Sequelize.STRING,
      },
      current_bid: {
          type: Sequelize.STRING,
      },
      status: {
          type: Sequelize.TINYINT,
      },
      expiry_date: {
        type: Sequelize.DATE,
      },
      uuid: {
          type: Sequelize.STRING,
      },
      user_uuid: {
          type: Sequelize.STRING,
      },
      admin_uuid: {
        type: Sequelize.STRING,
    },
  });

  return Cars;
};
