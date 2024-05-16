const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Product = new Schema({
	type: Number,
	status: Number,
	brandId: Schema.ObjectId,
    name: String,
    discount: Number,
    image: String,
    images: Array,
    price: Number,
    slug: String,
    specifications: Array,
    number: Number,
    typeAccessory: Number,
    description: String,
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Product', Product);