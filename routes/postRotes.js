const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post_controllers");
const authentication = require("../middleware/user_middelware");
const upload = require("../middleware/multer-config");

/* GET home page Feed */
router.get("/", authentication, postCtrl.getAllPosts);
router.get("/:id", authentication, postCtrl.singlePost);
router.post("/", authentication, upload, postCtrl.createNewPost);
//  -- //! put - replace whole object
//  -- //! patch- only replace changeing object
router.put("/:id", authentication, postCtrl.updatePost);
router.delete("/:id/", authentication, postCtrl.deletePost);

module.exports = router;
