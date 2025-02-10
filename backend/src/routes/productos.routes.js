const { Router } = require('express')
const { handleCreateProduct, handleGetAllProducts, handleGetProductById, handleUpdateProduct, handleDeleteProduct } = require('../controllers/productos.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')


const router = Router()

router.get('/', handleGetAllProducts)
router.get('/:id', handleGetProductById)
//incroporar autenticacion admin
router.post('/', handleCreateProduct, verifyTokenMiddleware)
router.put('/:id', handleUpdateProduct, verifyTokenMiddleware)
router.delete('/:id', handleDeleteProduct, verifyTokenMiddleware)

module.exports = router