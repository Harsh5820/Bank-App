import express from "express";
import connectDb from "../Config/ConnectDb.js";
import dotenv from "dotenv";
import cors from "cors";

// Load env
dotenv.config();

const app = express();

// ✅ CORS
app.use(
  cors({
    origin: "*",
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

// Apply before routes
app.use(ensureDbConnection);

// ✅ Routes (IMPORTANT: add .js extension)
import userRoutes from "../Routes/userRoutes.js";
import accountRoutes from "../Routes/accountRoutes.js";
import transactionRoutes from "../Routes/transactionRoutes.js";
import bannerRoutes from "../Routes/bannerRoutes.js";
import rewardRoutes from "../Routes/RewardCoinAccountRoutes.js";
import beneficiaryRoutes from "../Routes/BeneficiaryRoutes.js";
import notificationRoutes from "../Routes/NotificationRoutes.js";

app.use("/user", userRoutes);
app.use("/account", accountRoutes);
app.use("/transaction", transactionRoutes);
app.use("/banner", bannerRoutes);
app.use("/reward", rewardRoutes);
app.use("/beneficiary", beneficiaryRoutes);
app.use("/notifications", notificationRoutes);

// ❌ NO app.listen()

// ✅ Export default
export default app;