const express = require("express");
const router = express.Router();
const { createPost , toggleLike , deletePost} = require("../controller/post.controller");
const {getPosts} = require("../controller/feedpost")
const {protect} = require("../Middleware/auth.middleware");
const {getUserPosts} = require("../controller/getuserpost.controller")

router.post("/create",protect,createPost);
router.get("/userpost",protect,getUserPosts);
router.get("/feed",protect,getPosts);
router.post("/like/:postId",protect,toggleLike);
router.delete("/:postId",protect,deletePost)

module.exports = router;