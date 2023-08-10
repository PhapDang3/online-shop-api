const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');

const upload = multer({
    limits: {
        fileSize: 5000000 // Giới hạn kích thước tệp (5MB)
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Vui lòng tải lên một tệp hình ảnh.'));
        }
        cb(undefined, true);
    }
});



// Create a new product
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const productData ={...req.body};
        if (typeof productData.image === 'string') {
            // Handle as a URL
        } else if (Buffer.isBuffer(productData.image)) {
            // Handle as binary image data
            productData.image = req.file.buffer;  // Retrieve image data from buffer
        } else {
            // Handle other cases or throw an error
            throw new Error("Invalid image data");
        }
        // chuyển giá trị
        productData.price = parseFloat(productData.price);
        const product = new Product(productData);
        await product.save();
        // Log the product data for debugging purposes
        console.log("Product Data:", productData);
        res.status(201).send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find({}).populate('category');
        res.send(products);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get a specific product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Update a product
router.put('/products/:id',upload.single('image'), async (req, res) => {
    try {
        const updates = { ...req.body };
         // Handle the image data just like in the POST route
         if (typeof updates.image === 'string') {
            // Handle as a URL
        } else if (Buffer.isBuffer(updates.image)) {
            // Handle as binary image data
            updates.image = req.file.buffer;
        } else {
            // Handle other cases or throw an error
            throw new Error("Invalid image data");
        }
        updates.price = parseFloat(updates.price);
        
        console.log("Updating product with ID:", req.params.id);
        console.log("Received updates:", updates);
        const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        console.log("Updated product:", product);
        if (!product) {
        console.error("Error occurred:", error);

            return res.status(404).send();
        }
        res.send(product);
       

    } catch (error) {
        
        res.status(500).send(error);
    }
});

// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id, req.body,{new: true, runValidators: true });
        if (!product) {
            return res.status(404).send();
        }
        res.send(product);
    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).send(error);
    }
});

module.exports = router;
