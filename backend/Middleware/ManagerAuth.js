const jwt = require("jsonwebtoken");

const ManagerAuth = async (req, res, next) => {
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
      if(req.user.userRole !== "Manager"){
        return res.status(400).json({error:"Not Authorized to approve"})
      }
      next();
    });
  } catch (error) {
    return res.status(400).json(error)
  }
};

module.exports = ManagerAuth;
