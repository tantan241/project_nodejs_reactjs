const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Account = new Schema({
	userName: String,
	password: String,
	createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Account', Account);