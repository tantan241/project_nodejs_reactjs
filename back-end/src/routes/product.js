const express = require("express");
const router = express.Router();
const productController = require("../app/controllers/product");
const { authorization } = require("../common");

router.post("/add", authorization, productController.addNewProduct);
router.get("/:id", authorization, productController.getOneProduct);
router.post("/:id", authorization, productController.updateProduct);
router.post("/", authorization, productController.getListProducts);

module.exports = router;
