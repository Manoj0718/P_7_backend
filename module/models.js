const dbConfig = require("../db_config/db.config");
const Sequelize = require("sequelize");

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
db.status = require("./checking")(sequalize, Sequelize);
db.comments = require("./comments.model.js")(sequalize, Sequelize);

//*------------------remove 'as'----------------------------------//
//* CASCADE : Delete or update the row from the parent table and automatically delete or update the matching rows in the child table. ... SET NULL : Delete or update the row from the parent table and set the foreign key column or columns in the child table to NULL .
db.comments.belongsTo(db.post,{onDelete: 'cascade'});
db.comments.belongsTo(db.user,{onDelete: 'cascade'});

db.post.hasMany(db.comments,{onDelete: 'cascade'});
db.post.hasMany(db.status,{onDelete: 'cascade'});
db.post.belongsTo(db.user);

db.user.hasMany(db.post,{onDelete: 'cascade'});
db.user.hasMany(db.comments,{onDelete: 'cascade'});
db.user.hasMany(db.status,{onDelete: 'cascade'});

db.status.belongsTo(db.user,{as:this.user,foreignKey:'userId'});
db.status.belongsTo(db.post,{as:this.post,foreignKey:'postId'});



// db.comments.belongsToMany(db.user,{through : db.post});
//*--------------------------------------//

module.exports = db;

//!source - https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/
