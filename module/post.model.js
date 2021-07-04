const db = require("../module/models");
//const User = db.user;

//const Post = require("./user.model");

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
    // userId: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: User,
    //     key: "id",
    //   },
    // },
  });
  return Post;
};
