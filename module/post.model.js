//?make sure to update null or not null in MYSQL data base. if not null, u need to fill it always//
module.exports = (sequelize, Sequelize) => {
  const Post = sequelize.define("post", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: Sequelize.STRING,

    },
    content: {
      type: Sequelize.STRING,
    },

    imageUrl: {
      type: Sequelize.STRING,
    },
  });
  return Post;
};