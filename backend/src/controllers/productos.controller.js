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
    const { id } = req.params
    try {
        const product = await getProductById(id)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json(product)
    } catch (error) {
        next(error)
    }
}

const handleCreateProduct = async (req, res, next) => {
    const { nombre_producto, descripcion, precio, stock } = req.body

    if (!nombre_producto || !descripcion || !precio || !stock) {
        return res.status(400).json({ error: 'Faltan datos' })
    }
    try {
        const product = await createProduct(nombre_producto, descripcion, precio, stock)
        res.status(201).json(product)
    } catch (error) {
        next(error)
    }
}

const handleUpdateProduct = async (req, res, next) => {
    const { id } = req.params
    const { nombre_producto, descripcion, precio, stock } = req.body

    if (!nombre_producto || !descripcion || !precio || !stock) {
        return res.status(400).json({ error: 'Faltan datos' })
    }
    try {
        const product = await updateProduct(id, nombre_producto, descripcion, precio, stock)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto actualizado correctamente', product })
    } catch (error) {
        next(error)
    }
}

const handleDeleteProduct = async (req, res, next) => {
    const { id } = req.params
    try {
        const product = await deleteProduct(id)

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        res.status(200).json({ message: 'Producto eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}

module.exports = { handleCreateProduct, handleGetAllProducts, handleGetProductById, handleUpdateProduct, handleDeleteProduct }