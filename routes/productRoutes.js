
const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const multer = require('multer');
const { createResponse } = require('../models/responseHelper');



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
// router.post('/products', upload.single('image'), async (req, res) => {
//     try {
//         const productData ={...req.body};
//         if (typeof productData.image === 'string') {
//             // Handle as a URL
//         } else if (Buffer.isBuffer(productData.image)) {
//             // Handle as binary image data
//             productData.image = req.file.buffer;  // Retrieve image data from buffer
//         } else {
//             // Handle other cases or throw an error
//             throw new Error("Invalid image data");
//         }
//         // chuyển giá trị
//         productData.price = parseFloat(productData.price);
//         const product = new Product(productData);
//         await product.save();
//         // Log the product data for debugging purposes
//         console.log("Product Data:", productData);
//         // res.status(201).send(product);
//         res.status(201).json(createResponse('success', product, 'Product created successfully'));
//     } catch (error) {
//         // res.status(500).send(error);
//         res.status(500).json(createResponse('error', null, error.message));

        
//     }
// });


// router.post('/products', upload.single('image'), async (req, res) => {
//     console.log("Received POST request at /products");
//     console.log("Received body:", req.body);
//     console.log("Received file:", req.file);
//     try {
//         const productData = {...req.body};
//         if (req.file && req.file.buffer) {
//             console.log("Processing image buffer...");
//             productData.image = req.file.buffer;  // Retrieve image data from buffer
//         } else {
//             throw new Error("Image is required and should be in buffer format");
//         }

//         productData.price = parseFloat(productData.price);
//         console.log("Creating new product with data:", productData);
//         const product = new Product(productData);
//         await product.save();
//         console.log("Product successfully created:", product);
//         res.status(201).json(createResponse('success', product, 'Product created successfully'));

//     } catch (error) {
//         console.error("Error occurred:", error.message);
//         res.status(500).json(createResponse('error', null, error.message));


//     }
// });

// new post
router.post('/products', upload.single('image'), async (req, res) => {
    try {
        const productData = {...req.body};
        if (typeof req.body.image === 'string') {
            productData.image = req.body.image;  // Handle as a URL
        } else if (req.file && req.file.buffer) {
            productData.image = req.file.buffer;  // Handle as binary image data
        } else {

            throw new Error("Invalid image data");
        }

        productData.price = parseFloat(productData.price);
        const product = new Product(productData);
        await product.save();

        res.status(201).json(createResponse('success', product, 'Product created successfully'));
    } catch (error) {

        res.status(500).json(createResponse('error', null, error.message));

        
    }
});


// Get all products
router.get('/products', async (req, res) => {

    try {
        const products = await Product.find({}).populate('category');
        console.log("Products fetched:", products);
        // res.send(products);
        res.json(createResponse('success', products, 'Products fetched successfully'));

    } catch (error) {
             console.error("Error fetching products:", error);
        // res.status(500).send(error);
        res.status(500).json(createResponse('error', null, error.message));

    }
});





// Retrieve and send the image of a product based on its ID
router.get('/products/:id/image', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product || !product.image) {
            throw new Error('Product not found or does not have an image');
        }

        res.set('Content-Type', 'image/jpeg');  // Assuming the image is in JPEG format
        res.send(product.image);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


// Get a specific product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('category');
        res.json(createResponse('success', product, null));

        if (!product) {
            // return res.status(404).send();
        res.status(404).json(createResponse('error', null, 'Product not found'));

        }
        res.send(product);
    } catch (error) {
        // res.status(500).send(error);
        res.status(500).json(createResponse('error', null, error.message));

    }
});

// Update a product
// router.put('/products/:id',upload.single('image'), async (req, res) => {
//     console.log("Received request to update product with ID:", req.params.id);
//     console.log("Received body:", req.body);
//     console.log("Received image file:", req.file);
//        // Log the image file
//        console.log("Type of req.body.image:", typeof req.body.image);
//        console.log("Is req.file.buffer a buffer?", Buffer.isBuffer(req.file.buffer));
//        console.log("req.file.buffer:", req.file.buffer);
//     if (req.file) {
//         console.log("Received image file:", req.file);
//         console.log("Received image buffer:", req.file.buffer);
//     } else {
//         console.log("No image file received.");
//     }
//     try {
//         const updates = { 
//                 // Lấy các trường từ req.body và chuyển đổi chúng nếu cần
//             name: req.body.name,
//             price: parseFloat(req.body.price),
//             description: req.body.description,
//             category: req.body.category

//          };
//          // Handle the image data just like in the POST route
//          if (req.file && req.file.buffer) {
//             updates.image = req.file.buffer;
//         } else {
//             throw new Error("Invalid image data");
//         }
//         updates.price = parseFloat(updates.price);
        
//         console.log("Updating product with ID:", req.params.id);
//         console.log("Received updates:", updates);
//         const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
//         console.log("Received product name:", req.body.name);
//         console.log("Received product price:", req.body.price);
//         console.log("Received product price:", req.body.image);

//         // Thêm log cho các trường khác

//         console.log("Updated product:", product);
//         if (!product) {
//         console.error("Error occurred:", error);

//             // return res.status(404).send();
//             console.error("Error occurred while updating product:", error);
//             res.status(404).json(createResponse('error', null, 'Product not found'));

//         }
//         res.send(product);
       

//     } catch (error) {
        
//         // res.status(500).send(error);
//         res.status(500).json(createResponse('error', null, error.message));

//     }
// });



router.put('/products/:id', upload.single('image'), async (req, res) => {
    console.log("Received body:", req.body);
    console.log("Received file:", req.file);
    const updates = {
        name: req.body.name,
        price: parseFloat(req.body.price),
        description: req.body.description,
        category: req.body.category
    };

    if (req.file && req.file.buffer) {
        updates.image = req.file.buffer;
    } else {
        throw new Error("Invalid image data");
    }

    console.log("Updating product with ID:", req.params.id);
    console.log("Received updates:", updates);

    const product = await Product.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (product) {
        res.send(product);

    }else{
        return res.status(404).json(createResponse('error', null, 'Product not found'));

    }
});


// Delete a product
router.delete('/products/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id, req.body,{new: true, runValidators: true });
        if (!product) {
            // return res.status(404).send();
           return res.status(404).json(createResponse('error', null, 'Product not found'));

        }
        res.json(createResponse('success', product, 'Product deleted successfully'));
    } catch (error) {
        console.error("Error occurred:", error);
        // res.status(500).send(error);
        return res.status(500).json(createResponse('error', null, error.message));

    }
});

module.exports = router;
