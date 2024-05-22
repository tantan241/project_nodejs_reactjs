const multer = require('multer');
const path = require('path');
class fileController {
    storageImage = multer.diskStorage({
  
        destination: (req, file, cb) => {
         
          cb(null, path.join(__dirname, '../../media/images'))
           // Đường dẫn lưu trữ file
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file theo thời gian hiện tại
        }
      });
    upload = multer({ storage: this.storageImage });
    postImage = (req, res) => {
       
        try {
          res.status(200).json({
            status: 200,
            message: 'File is uploaded',
            data: {
              name: req.file.filename,
              mimetype: req.file.mimetype,
              size: req.file.size
            }
          });
        } catch (err) {
          res.status(400).json({
            status: false,
            message: 'File upload failed',
            error: err.message
          });
        }
      };
}

module.exports = new fileController()