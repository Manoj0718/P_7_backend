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

    userId: {
      type: Sequelize.INTEGER,
    //   //allowNull: false,
    //   // references: {
    //   //   model: "user", // 'Movies' would also work
    //   //   key: "id",
    //   // },
     },
    postId: {
      type: Sequelize.INTEGER,
      
      references: {
        model: "post", // 'Actors' would also work
        key: "id",
      },
    },
  });

  return Comments;
};
