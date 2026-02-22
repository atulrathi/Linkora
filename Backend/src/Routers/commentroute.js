const express = require("express");
const router = express.Router();
const {addComment,getComments,deleteComment} = require("../controller/comment.controller");
const {protect} = require("../Middleware/auth.middleware");

router.post("/:postId",protect,addComment);
router.get("/:postId",protect,getComments);
router.delete("/:commentId",protect,deleteComment);

module.exports = router;