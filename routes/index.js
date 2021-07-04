const express = require("express");
const router = express.Router();
const db = require("../db_config/db.config");
const user_Controllers = require("../controllers/user_controllers");

/* GET home page. */
// router.get("/", (req, res, next) => {
//   //res.render('Groupmania');
//   res.json({
//     massage: "ok",
//   });
// });

/* get login */
// router.get("/api/auth/login", (req, res, next) => {
//   res.send("GET/signup_page");
// });

/* POST login */
router.post("/login", user_Controllers.login);
/*get All Users */
router.get("/users", user_Controllers.getAllUsers);
/*POST signup */
router.post("/signup", user_Controllers.signup);

/*GET profile */
//!pay special attention to /:id
//! y? we use this as re.parms. nor user_id, id
router.get("/users/:id",user_Controllers.singleUser);

/*update profile*/ 
//!pay special attention to /:id
router.patch("/users/:id",user_Controllers.updateSingleUser);

/*delete profile*/
//!pay special attention to /:id - 
router.delete("/users/:id", user_Controllers.delete);

/* forgot password  login */
// router.get('/forgot_pw',(req, res, next)=> {
//   res.send('GET/forgot_password');
// });

// /*update password */
// router.put('/forgot_pw',(req, res, next)=> {
//   res.send('PUT/forgot_password');
// });

// /*reset password */
// router.get('/reset_pw/:token',(req, res, next)=> {
//   res.send('GET/reset_password');
// });

// /*update database password */
// router.put('/reset_pw/:token',(req, res, next)=> {
//   res.send('put/reset_password');
// });

module.exports = router;

// get index '/'
//  POST /login
//  POST /signup
// GET /:id
//
