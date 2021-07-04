const express = require("express");
const router = express.Router();
const comments_Controller = require("../controllers/comments_controllers");
const auth = require("../middleware/user_middelware");

router.get("/",auth, comments_Controller.get_All_Comments);

//router.get("/:id", comments_Controller.get_single_comment);

router.post("/",auth, comments_Controller.create_New_Comments);

//router.patch("/:id", comments_Controller.update_comment);

router.delete("/:id",auth, comments_Controller.delete_comments);

module.exports = router;
