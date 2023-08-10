const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    price: { type: Number, required: true },
    image: { type: Buffer, required: true },
    description: { type: String, required: true }
    
});

module.exports = mongoose.model('product', ProductSchema);
