const express = require('express');
const router = express.Router();
const {gitpage , githubcallback , getRepos} = require('../controller/git.controller');
const {protect } = require("../Middleware/auth.middleware")

router.get("/Oauth",protect,gitpage);
router.get("/callback",protect,githubcallback);
router.get("/repos",protect,getRepos);

module.exports = router;