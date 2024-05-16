const express = require('express');
const routes = express.Router()
const productController = require('../app/controllers/product')
const {authorization} = require("../common")

routes.post('/',authorization, productController.getListProducts)

module.exports = routes