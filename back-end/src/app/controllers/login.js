const Account = require("../models/Account");
const jwt = require("jsonwebtoken");
class loginController {
	login(req, res) {
		Account.findOne(req.body)
			.then((accounts) => {
               
				const users = { userName: accounts.userName };
				const token = jwt.sign(users, process.env.ACCESS_TOKEN, { expiresIn: 3000 });
				res.status(200).json({ token: token, status: 200, messenger: "Đăng nhập thành công" });
			})
			.catch((err) => {
				// Xử lý lỗi nếu có
				res.status(500).json({ status: 500, messenger: "Đăng nhập thất bại" });
			});

		// return res.send("test")
	}
}

module.exports = new loginController();
