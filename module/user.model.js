// //?--------config sequalizer----------- ////
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_email: {
      type: Sequelize.STRING,
      unique: true,
    },
    user_password: {
      type: Sequelize.STRING,
    },
    first_name: {
      type: Sequelize.STRING,
    },
    last_name: {
      type: Sequelize.STRING,
    },
    user_hobbies: {
      type: Sequelize.STRING,
    },
    user_bio: {
      type: Sequelize.STRING,
    },
  });
  return User;
};