const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller")
const {protect} = require("../Middleware/auth.middleware")
const upload = require("../Middleware/upload.middleware")

router.get("/",protect,userController.getUserByUsername);
router.post("/upload/profilepic",protect,upload.single("image"),userController.uploadProfileImage);
router.post("/upload/coverphoto",protect,upload.single("image"),userController.uploadcoverphoto);

module.exports = router;