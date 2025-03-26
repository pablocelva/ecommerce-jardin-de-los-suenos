const { Router } = require('express')
const { 
    handleCreateProduct, 
    handleGetAllProducts, 
    handleGetProductById, 
    handleUpdateProduct, 
    handleDeleteProduct, 
    handleGetImagenesByIdProducto,
    handleGetImagenes,
    handleGetAllCategorias,
    handleGetProductsByCategoria
} = require('../controllers/productos.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')


const router = Router()

router.get('/', handleGetAllProducts)
router.get('/imagenes', handleGetImagenes)
router.get('/:id/imagenes', handleGetImagenesByIdProducto)
router.get('/:id', handleGetProductById)
router.get('/categorias', handleGetAllCategorias)
router.get('/categorias/:id', handleGetProductsByCategoria)
//incroporar autenticacion admin
router.post('/', verifyTokenMiddleware, handleCreateProduct)
router.put('/:id', verifyTokenMiddleware, handleUpdateProduct)
router.delete('/:id', verifyTokenMiddleware, handleDeleteProduct)

module.exports = router