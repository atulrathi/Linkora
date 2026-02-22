const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller")
const {protect} = require("../Middleware/auth.middleware")

router.get("/",protect,userController.getUserByUsername);

module.exports = router;