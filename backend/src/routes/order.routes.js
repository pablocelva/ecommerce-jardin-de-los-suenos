const { Router } = require('express')
const { handleCreateOrder, handleGetAllOrders, handleGetOrdersByUserId, handleGetOrderByOrderId, handleUpdateOrderStatus, handleDeleteOrder } = require('../controllers/order.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')

const router = Router()

router.get('/', handleGetAllOrders)
router.get('/pedido/:id_compra', handleGetOrderByOrderId)
router.get('/usuario/:id_usuario', handleGetOrdersByUserId)
router.post('/', handleCreateOrder, verifyTokenMiddleware)
//incroporar autenticacion admin
router.put('/pedido/:id_compra', verifyTokenMiddleware, handleUpdateOrderStatus)
router.delete('/pedido/:id_compra', verifyTokenMiddleware,  handleDeleteOrder)

module.exports = router