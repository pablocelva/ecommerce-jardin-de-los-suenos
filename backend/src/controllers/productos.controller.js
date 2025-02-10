const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require('../models/productosModel')

const handleGetAllProducts = async (req, res, next) => {
    try {
        const products = await getAllProducts()
        res.status(200).json(products)

        if (!products) {
            return res.status(404).json({ error: 'No hay productos' })
        }

    } catch (error) {
        next(error)
    }
}

const handleGetProductById = async (req, res, next) => {
    try {
        const product = await getProductById(req.params.id)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const handleCreateProduct = async (req, res, next) => {
    try {
        const product = await createProduct(req.body)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
}

const handleUpdateProduct = async (req, res, next) => {
    try {
        const product = await updateProduct(req.params.id, req.body)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const handleDeleteProduct = async (req, res, next) => {
    try {
        const product = await deleteProduct(req.params.id)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

module.exports = { handleCreateProduct, handleGetAllProducts, handleGetProductById, handleUpdateProduct, handleDeleteProduct }