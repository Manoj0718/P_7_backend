module.exports = (sequelize, Sequelize) => {
  const Comments = sequelize.define("comments", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      required: true,
    },

    UserId: {
      type: Sequelize.INTEGER,
      //allowNull: false,
      // references: {
      //   model: "user", // 'Movies' would also work
      //   key: "id",
      // },
    },
    PostId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      // references: {
      //   model: "post", // 'Actors' would also work
      //   key: "id",
      // },
    },
  });

  return Comments;
};
