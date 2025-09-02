const express = require("express");
const {
  userSignUp,
  userLogin,
  getUser,
  userManagerApproval,
  usersToApprove,
  getUserById,
  editUser,
  deleteUser,
} = require("../Controllers/userController");
const verifyToken = require("../Middleware/Auth");
const ManagerAuth = require("../Middleware/ManagerAuth");
const router = express.Router();

router.post("/signup", userSignUp);
router.post("/login", userLogin);
router.get("/getuser", verifyToken, getUser);
router.get("/getuserbyid/:id", verifyToken, getUserById);
router.post("/edituser/:id", verifyToken, editUser);
router.delete("/deleteuser", verifyToken, deleteUser);

//Manager approvals
router.post("/usermanagerapproval/:id", ManagerAuth, userManagerApproval);
router.get("/userstoapprove", ManagerAuth, usersToApprove);

module.exports = router;
