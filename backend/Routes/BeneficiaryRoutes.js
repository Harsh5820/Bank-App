const express = require("express");
const {
  addBeneficiary,
  myBeneficiaries,
  editBeneficiary,
  deleteBeneficiary,
  myBeneficiary,
} = require("../Controllers/beneficiaryController");
const verifyToken = require("../Middleware/Auth");

const router = express.Router();

router.post("/addbeneficiary", verifyToken, addBeneficiary);
router.get("/mybeneficiaries", verifyToken, myBeneficiaries);
router.post("/editbeneficiary/:id", verifyToken, editBeneficiary);
router.delete("/deletebeneficiary/:id", verifyToken, deleteBeneficiary);
router.get("/mybeneficiary/:id", verifyToken, myBeneficiary);

module.exports = router;
