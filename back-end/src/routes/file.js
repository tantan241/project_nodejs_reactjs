const express = require("express");
const router = express.Router();
const fileController = require("../app/controllers/file");
const { authorization } = require("../common");

router.post('/image', authorization, fileController.upload.single('file'), fileController.postImage)
module.exports = router;
