const express = require("express");
const connectDb = require("./Config/ConnectDb");
const app = express();
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());

app.use("/user", require("./Routes/userRoutes")); //All the user routes will be handled here
app.use("/account", require("./Routes/accountRoutes")); //All the account routes will be handled here
app.use("/transaction", require("./Routes/transactionRoutes")); //All the transactions will be handeld here
app.use("/banner", require("./Routes/bannerRoutes")) // All the banners will be handled from here

connectDb()
  .then(() => {
    app.listen(PORT, (err) => {
      console.log("The app is running on port: ", PORT);
    });
  })
  .catch((error) => {
    console.log("The app is running on port: ", error);
  });
