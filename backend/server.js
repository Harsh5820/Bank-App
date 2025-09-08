const express = require("express");
const connectDb = require("./Config/ConnectDb");
const dotenv = require("dotenv").config();
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

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

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE","PUT"],
    credentials: true,
  },
});

let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("🔗 New client connected:", socket.id);
  socket.on("registerUser", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log(`✅ User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    Object.keys(onlineUsers).forEach((userId) => {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log(`❌ User ${userId} disconnected`);
      }
    });
  });
});

app.set("io", io);
app.set("onlineUsers", onlineUsers);

connectDb()
  .then(() => {
    server.listen(PORT, () => {
      console.log("🚀 Server running on port:", PORT);
    });
  })
  .catch((error) => {
    console.error("❌ DB connection failed:", error);
  });
