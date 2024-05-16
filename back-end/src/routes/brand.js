const express = require('express');
const {authorization} = require('../common');
const route = express.Router()
const brandController = require('../app/controllers/brand')

route.post('/add',authorization, brandController.addNewBrand)
route.delete('/delete',authorization, brandController.deleteBrand)
route.get('/:id',authorization, brandController.getBrandDetail)
route.post('/:id',authorization, brandController.updateBrand)
route.post('/',authorization, brandController.getListBrand)

module.exports = route