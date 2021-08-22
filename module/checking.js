module.exports = (sequelize, Sequelize) => {
    const Seen = sequelize.define("status", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      //* not working ??, cz i didn't import database//
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "user", // 'Movies' would also work
          key: "id",
        },
       },
      postId: {
        type: Sequelize.INTEGER,
        references: {
          model: "post", // 'Actors' would also work
          key: "id",
        },
      
      },
      // is_status : {
      //   type : Sequelize.BOOLEAN,
      //    DEFAULT: false,
      // }
      
    });
  
    return Seen;
  };
  