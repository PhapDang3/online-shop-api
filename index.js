const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
mongoose.set("bufferCommands", false);
require("dotenv").config();

// const winston = require('winston');
const uri = process.env.SEVER;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const app = express();
app.use(bodyParser.json({ limit: "50mb" }));

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userRouter = require("./routes/userRoutes");
const categoryRouter = require("./routes/categoryRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const orderDetailRouter = require("./routes/orderDetailRoutes");
const reviewRouter = require("./routes/productReviewRoutes");

app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(orderDetailRouter);
app.use(reviewRouter);
