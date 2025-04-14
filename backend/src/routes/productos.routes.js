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
    handleGetProductsByCategoria,
    handleAddProductCategoria,
    handleUpdateProductCategoria,
    handleDeleteProductCategoria,
    handleGetCategoriasByIdProducto,
    handleAddImagenProducto
} = require('../controllers/productos.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')

const router = Router()

router.get('/', handleGetAllProducts)
router.get('/imagenes', handleGetImagenes)
router.get('/categorias', handleGetAllCategorias)
router.get('/categorias/:id', handleGetProductsByCategoria)
router.get('/:id/imagenes', handleGetImagenesByIdProducto)
router.get('/:id/categorias', handleGetCategoriasByIdProducto)
router.get('/:id', handleGetProductById)
//incroporar autenticacion admin
router.post('/', verifyTokenMiddleware, handleCreateProduct)
router.put('/:id', verifyTokenMiddleware, handleUpdateProduct)
router.delete('/:id', verifyTokenMiddleware, handleDeleteProduct)

router.post('/imagenes', verifyTokenMiddleware, handleAddImagenProducto)

router.post('/:id/categorias', verifyTokenMiddleware, handleAddProductCategoria)
router.put('/:id/categorias', verifyTokenMiddleware, handleUpdateProductCategoria)
router.delete('/:id/categorias', verifyTokenMiddleware, handleDeleteProductCategoria)
module.exports = router