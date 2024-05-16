const express = require('express')
const morgan = require('morgan')
const route = require('./routes')
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors())
const dotenv  = require('dotenv')

const port = 8000

// conect db
const db = require("./config/db/index")
db.connect()
app.use(morgan('combined'))
dotenv.config()
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

route(app)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})