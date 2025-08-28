const express = require("express");
const {
  userSignUp,
  userLogin,
  getUser,
} = require("../Controllers/userController");
const verifyToken = require("../Middleware/Auth");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/getuser", verifyToken, getUser);

module.exports = router;
