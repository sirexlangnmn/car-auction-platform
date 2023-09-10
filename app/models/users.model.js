module.exports = (sequelize, Sequelize) => {
  // comment
  // status
  //    1 = active user
  //    2 = ban
  const Users = sequelize.define('users', {
      full_name: {
          type: Sequelize.STRING,
      },
      status: {
          type: Sequelize.TINYINT,
      },
      uuid: {
          type: Sequelize.STRING,
      },
  });

  return Users;
};
