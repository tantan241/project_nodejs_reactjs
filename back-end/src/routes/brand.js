const express = require('express');
const {authorization} = require('../common');
const router = express.Router()
const brandController = require('../app/controllers/brand')

router.post('/add',authorization, brandController.addNewBrand)
router.delete('/delete',authorization, brandController.deleteBrand)
router.get('/:id',authorization, brandController.getBrandDetail)
router.post('/:id',authorization, brandController.updateBrand)
router.post('/',authorization, brandController.getListBrand)

module.exports = router