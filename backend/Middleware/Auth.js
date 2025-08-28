const jwt = require("jsonwebtoken");

const verifyToken = async (req, res, next) => {
  try {
    const token = await req.header("Authorization")?.replace("Bearer ");
    if (!token) {
      return res.status(400).json({ error: "Auth failed!!" });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(400).json(err);
      }
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = verifyToken;
