const express = require("express");
const router = express.Router();
const auth = require("../middleware/user_middelware");
const seen_Sontrollers = require("../controllers/seen_controllers");

router.post("/post_has_seen", auth, seen_Sontrollers.reactPost);
//router.get("/post_has_seen",auth, seen_Sontrollers.getreactions);

module.exports = router;