const Banner = require("../Models/BannerModel");

const newBanner = async (req, res) => {
  const { bannerUrl, bannerAlt } = req.body;
  try {
    if (!bannerAlt || !bannerUrl) {
      return res.status(400).json({ error: "All fields are Mandatory !!" });
    }

    const newBanner = await Banner.create({
      bannerUrl: bannerUrl,
      bannerAlt: bannerAlt,
    });

    return res.status(200).json(newBanner);
  } catch (error) {
    return res.status(400).json({ error: "Banner not created!!!" });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const allBanners = await Banner.find();
    const randomBannerUrlArray = allBanners.map((banner) => banner.bannerUrl);

    return res.status(200).json({ allBanners, randomBannerUrlArray });
  } catch (error) {
    return res.status(400).json({ error: "Error fetching all the banners" });
  }
};

module.exports = { newBanner, getAllBanners };
