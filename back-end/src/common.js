const jwt = require("jsonwebtoken");
function authorization(req, res, next) {
	const authorizationHeader = req.headers["authorization"];
	if (!authorizationHeader || authorizationHeader === "undefined") {
		res.sendStatus(401);
		return;
	}
	const token = authorizationHeader.split(" ")[1];
	if (!token) {
		res.status(401);
		return;
	}

	jwt.verify(token, process.env.ACCESS_TOKEN, (err, data) => {
		if (err) res.status(403);
		next();
	});
}

module.exports = { authorization };
