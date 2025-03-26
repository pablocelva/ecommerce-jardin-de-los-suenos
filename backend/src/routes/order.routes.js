const express = require('express')
const { handleCreateOrder, handleGetAllOrders, handleGetOrdersByUserId, handleGetOrderByOrderId, handleUpdateOrderStatus, handleDeleteOrder } = require('../controllers/order.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')

const router = express.Router()

// Middleware para parsear JSON
router.use(express.json())

router.get('/', verifyTokenMiddleware, handleGetAllOrders)
router.get('/pedido/:id_compra', verifyTokenMiddleware, handleGetOrderByOrderId)
router.get('/usuario/:id_usuario', verifyTokenMiddleware, handleGetOrdersByUserId)
router.post('/', handleCreateOrder)
//incroporar autenticacion admin
router.put('/pedido/:id_compra', verifyTokenMiddleware, handleUpdateOrderStatus)
router.delete('/pedido/:id_compra', verifyTokenMiddleware,  handleDeleteOrder)

module.exports = router