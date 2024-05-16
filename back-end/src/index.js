const express = require("express");
const morgan = require("morgan");
const route = require("./routes");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

app.use(bodyParser.json());

app.use(cors());

const dotenv = require("dotenv");

app.use("/static", express.static(path.join(__dirname, "media")));

// conect db
const db = require("./config/db/index");
db.connect();

app.use(morgan("combined"));

dotenv.config();

route(app);

const port = 8000;
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
