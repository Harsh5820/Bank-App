const express = require("express");
const { newBanner, getAllBanners } = require("../Controllers/bannerController");

const router = express.Router();

router.post("/newbanner", newBanner)
router.get("/allbanners", getAllBanners)

module.exports = router;