const { Router } = require('express')
const { handleCreateOrder, handleGetAllOrders, handleGetOrdersByUserId, handleUpdateOrderStatus, handleDeleteOrder } = require('../controllers/order.controller')
const { verifyToken, verifyTokenMiddleware } = require('../helpers/jwt')


const router = Router()

router.get('/', handleGetAllOrders)
router.get('/usuario/:id_usuario', handleGetOrdersByUserId)
router.post('/', handleCreateOrder, verifyTokenMiddleware)
//incroporar autenticacion admin
router.put('/:id_compra', handleUpdateOrderStatus, verifyTokenMiddleware)
router.delete('/:id_compra', handleDeleteOrder, verifyTokenMiddleware)

module.exports = router