const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const Brand = new Schema({
	name: String,
	status: Number,
});

Brand.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});
module.exports = mongoose.model("Brand", Brand);
