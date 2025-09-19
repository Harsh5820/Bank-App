const express = require("express");
const connectDb = require("./Config/ConnectDb");
const dotenv = require("dotenv").config();
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use("/user", require("./Routes/userRoutes"));
app.use("/account", require("./Routes/accountRoutes"));
app.use("/transaction", require("./Routes/transactionRoutes"));
app.use("/banner", require("./Routes/bannerRoutes"));
app.use("/reward", require("./Routes/RewardCoinAccountRoutes"));
app.use("/beneficiary", require("./Routes/BeneficiaryRoutes"));
app.use("/notifications", require("./Routes/NotificationRoutes"));


connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log("🚀 Server running on port:", PORT);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
  });
