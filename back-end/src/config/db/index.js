const mongoose = require("mongoose");

async function connect() {
    try {
        await mongoose.connect("mongodb://localhost:27017/mobile_shop")
        console.log("Connect Successfully")
    } catch (error) {
        console.log("Connect Fail")
    }
  
}

module.exports = {connect}