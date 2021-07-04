const dbConfig = require("../db_config/db.config");
const Sequelize = require("sequelize");
//const { Sequelize, DataTypes } = require("sequelize");

const sequalize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
  //*why this ?? avoid table name plurizeing globally//
  define: {
    freezeTableName: true,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequalize;
//--this take from mysql database --//
db.user = require("./user.model.js")(sequalize, Sequelize);
db.post = require("./post.model.js")(sequalize, Sequelize);
db.comments = require("./comments.model.js")(sequalize, Sequelize);

//reletionship user/post/comments tabels// //
// db.user.hasMany(db.post, { as: "post" });
// db.post.belongsTo(db.user, {
//   foreignKey: "userId",
//   as: "user",
// });
// db.post.hasMany(db.comments);
// db.comments.belongsTo(db.post);

//*------------------remove 'as'----------------------------------//
db.comments.belongsTo(db.post);
db.post.hasMany(db.comments);
db.post.belongsTo(db.user);
db.user.hasMany(db.post);
//*--------------------------------------//

//TODO - here i tried to use my comments table with 'belongToMany' sequalize syntex, But it will throw a error //
//!-------- 01 st try like this ----------------//
//reletionship POST/comments/user table//

//db.user.belongsToMany(db.post, { through: db.comments });
//db.post.belongsToMany(db.user, { through: db.comments });

///db.post.belongsToMany(db.user, { through: db.comments });
//db.user.belongsToMany(db.post, { through: db.comments });
//!--end of 01st try ----------------------------//

//!-------- 02nd  try like this ----------------//
//reletionship comments table//
// db.post.belongsToMany(db.user, {
//   through: db.comments,
//   model: "user",
//   forignKey: "userId",
// });
// db.user.belongsToMany(db.post, {
//   through: db.comments,
//   as: "post",
//   forignKey: "postId",
// });
//!------------end of 02nd try ----------------------------//
module.exports = db;

//!source - https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/
