const express = require('express');
const router = express.Router();
const OrderDetail = require('../models/orderDetail');

// Create a new order detail
router.post('/orderdetails', async (req, res) => {
    const orderDetail = new OrderDetail(req.body);
    await orderDetail.save((error, document) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(201).send(document);
        }
    });
});

//... Other CRUD operations for Order Details ...

module.exports = router;
