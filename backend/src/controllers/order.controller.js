const { getAllOrders, getOrdersByUserId, createOrder, updateOrderStatus, deleteOrder } = require('../models/orderModel')

const handleGetAllOrders = async (req, res, next) => {
    try {
        const orders = await getAllOrders()
        res.status(200).json(orders)

        if (!orders) {
            return res.status(404).json({ error: 'No hay pedidos' })
        }

    } catch (error) {
        next(error)
    }
}

const handleGetOrdersByUserId = async (req, res, next) => {
    const { id_usuario } = req.params
    try {
        const orders = await getOrdersByUserId(id_usuario)

        if (!orders) {
            return res.status(404).json({ error: 'No hay pedidos' })
        }

        res.status(200).json(orders)
    } catch (error) {
        next(error)
    }
}

const handleCreateOrder = async (req, res, next) => {
    const { id_usuario,precio_total, detalle, direccion } = req.body

    if (!detalle || !detalle.length) return res.status(400).json({ message: 'El pedido no puede estar vacío' });

    try {
        const order = await createOrder(id_usuario, precio_total, detalle, direccion)
        res.status(201).json(order)
    } catch (error) {
        next(error)
    }
}

const handleUpdateOrderStatus = async (req, res, next) => {
    const { id_compra } = req.params
    const { estado } = req.body
    const validStatuses = ['pending', 'shipped', 'delivered', 'cancelled']

    if (!validStatuses.includes(estado)) {
        return res.status(400).json({ error: 'Estado inválido' })
    }

    try {
        const order = await updateOrderStatus(id_compra, estado)

        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado' });
        }

        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}

const handleDeleteOrder = async (req, res, next) => {
    const { id_compra } = req.params
    try {
        const order = await deleteOrder(id_compra)
        res.status(200).json(order)
    } catch (error) {
        next(error)
    }
}   

module.exports = { handleGetAllOrders, handleGetOrdersByUserId, handleCreateOrder, handleUpdateOrderStatus, handleDeleteOrder }