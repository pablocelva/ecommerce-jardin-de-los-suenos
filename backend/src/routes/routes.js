const express = require('express')
const usuariosRoutes = require('./usuarios.routes')
const productosRoutes = require('./productos.routes')
const orderRoutes = require('./order.routes')
const app = express()

app.use('/auth', usuariosRoutes)
app.use('/productos', productosRoutes)
app.use('/pedidos', orderRoutes)


module.exports = app