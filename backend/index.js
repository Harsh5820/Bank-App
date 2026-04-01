const express = require("express");
const connectDb = require("./Config/ConnectDb");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*", // change to frontend URL later
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());

// ✅ DB connection (serverless-safe)
let isConnected = false;

async function ensureDbConnection(req, res, next) {
  try {
    if (!isConnected) {
      await connectDb();
      isConnected = true;
      console.log("✅ DB Connected");
    }
    next();
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    res.status(500).json({ error: "Database connection failed" });
  }
}

// ✅ IMPORTANT: Apply BEFORE routes
app.use(ensureDbConnection);

// ✅ Routes
app.use("/user", require("../Routes/userRoutes"));
app.use("/account", require("../Routes/accountRoutes"));
app.use("/transaction", require("../Routes/transactionRoutes"));
app.use("/banner", require("../Routes/bannerRoutes"));
app.use("/reward", require("../Routes/RewardCoinAccountRoutes"));
app.use("/beneficiary", require("../Routes/BeneficiaryRoutes"));
app.use("/notifications", require("../Routes/NotificationRoutes"));

// ❌ DO NOT use app.listen()

// ✅ Export for Vercel
module.exports = app;