const express = require("express");
const router = express.Router();
const authController = require("../controller/auth.controller");
const {protect} = require("../Middleware/auth.middleware")

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/verify-otp", authController.verifyOtp);
router.get("/me", protect, (req, res) => {
  res.status(200).json({
    user: req.user
  });
});

module.exports = router;