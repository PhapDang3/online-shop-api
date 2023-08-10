const express = require('express');
const mongoose = require('mongoose');

const uri = "mongodb+srv://phapdn:123@cluster0.t8vv5ww.mongodb.net/dbShop?retryWrites=true&w=majority";

const app = express();


mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const PORT = process.env.PORT || 3000;
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const productRouter = require('./routes/productRoutes');
const orderRouter = require('./routes/orderRoutes');
const orderDetailRouter = require('./routes/orderDetailRoutes');
const reviewRouter = require('./routes/productReviewRoutes');
// Import các routes khác
// const { MongoClient, ServerApiVersion } = require('mongodb');
// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);




require('dotenv').config();

app.use(express.json());
app.use(userRouter);
app.use(categoryRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(orderDetailRouter);
app.use(reviewRouter);

app.listen(PORT, () => {
    console.log('Server is running on port 3000');
});
