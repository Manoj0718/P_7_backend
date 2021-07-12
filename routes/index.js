const express = require("express");
const router = express.Router();
const db = require("../db_config/db.config");
const user_Controllers = require("../controllers/user_controllers");

/* POST login */
router.post("/login", user_Controllers.login);
/*get All Users */
router.get("/users", user_Controllers.getAllUsers);
/*POST signup */
router.post("/signup", user_Controllers.signup);

/*GET profile */
router.get("/users/:id",user_Controllers.singleUser);

/*update profile*/ 
router.patch("/users/:id",user_Controllers.updateSingleUser);

/*delete profile*/
router.delete("/users/:id", user_Controllers.delete);


module.exports = router;

