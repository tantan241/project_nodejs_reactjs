const loginRoute = require('./login')
const brandRoute = require('./brand')
const productRoute = require('./product')
const fileRoute = require('./file')
function route(app) {
    app.use("/api/v1/admin/login",loginRoute)
    app.use("/api/v1/admin/brand",brandRoute)
    app.use("/api/v1/admin/product",productRoute)
    app.use("/api/v1/admin/upload",fileRoute)
}

module.exports = route