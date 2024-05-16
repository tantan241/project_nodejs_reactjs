const loginRoute = require('./login')
const brandRoute = require('./brand')
const productRoute = require('./product')
function route(app) {
    app.use("/api/v1/admin/login",loginRoute)
    app.use("/api/v1/admin/brand",brandRoute)
    app.use("/api/v1/admin/product",productRoute)
}

module.exports = route