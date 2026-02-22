const express = require("express");
const router = express.Router();
const {toggleFollow}= require("../controller/follow.controller");
const {protect} = require("../Middleware/auth.middleware");

router.post("/:userId",protect,toggleFollow);

module.exports = router