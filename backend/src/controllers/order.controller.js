const { getAllOrders, getOrdersByUserId, getOrderByOrderId, createOrder, updateOrderStatus, deleteOrder } = require('../models/orderModel')
const pool = require('../db/connection')

const handleGetAllOrders = async (req, res, next) => {
    try {
        const orders = await getAllOrders()
        res.status(200).json({ message: `Total de ordenes de compra: ${orders.length}`, orders })

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

        res.status(200).json({ message: `Ordenes de compra del ususario con id ${id_usuario}, total de ordenes: ${orders.length}`, orders })
    } catch (error) {
        next(error)
    }
}

const handleGetOrderByOrderId = async (req, res, next) => {
    const { id_compra } = req.params
    try {
        const order = await getOrderByOrderId(id_compra)
        if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado o no tienes permiso para eliminarlo' });
        }
        res.status(200).json({ message: `Detalle de la orden de compra con id ${id_compra}`, order })
    } catch (error) {
        next(error)
    }
}

const handleCreateOrder = async (req, res) => {
    try {
        // Verificar que req.body existe
        if (!req.body) {
            return res.status(400).json({ error: 'No se recibieron datos' });
        }

        // Extraer los datos del body
        const {
            id_usuario,
            nombre_cliente,
            email_cliente,
            productos,
            total,
            fecha_orden,
            estado,
            direccion_envio
        } = req.body;

        // Validar que todos los campos requeridos estén presentes
        if (!id_usuario || !nombre_cliente || !email_cliente || !productos || !total || !direccion_envio) {
            return res.status(400).json({
                error: 'Faltan campos requeridos para crear el pedido'
            });
        }

        // Crear el pedido en la base de datos
        const query = `
            INSERT INTO ordenes (
                id_usuario,
                nombre_cliente,
                email_cliente,
                productos,
                total,
                fecha_orden,
                estado,
                direccion_envio
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `;

        const values = [
            id_usuario,
            nombre_cliente,
            email_cliente,
            JSON.stringify(productos),
            total,
            fecha_orden || new Date(),
            estado || 'pendiente',
            JSON.stringify(direccion_envio)
        ];

        const result = await pool.query(query, values);
        
        res.status(201).json({
            message: 'Pedido creado exitosamente',
            order: result.rows[0]
        });

    } catch (error) {
        console.error('Error en handleCreateOrder:', error);
        res.status(500).json({
            error: 'Error al crear el pedido'
        });
    }
};

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

        res.status(200).json({ message: `Estado de la orden de compra con id ${id_compra} actualizado a ${estado} exitosamente`, order })
    } catch (error) {
        next(error)
    }
}

const handleDeleteOrder = async (req, res, next) => {
    const { id_compra } = req.params
    //const id_usuario = req.user.id;
    console.log(req.user);
    ////const { isAdmin } = req.user.rol === 'admin';
    try {
        const order = await deleteOrder(id_compra)
        console.log(order);
        /*if (!order) {
            return res.status(404).json({ error: 'Pedido no encontrado o no tienes permiso para eliminarlo' });
        }*/
        res.status(200).json({ message: 'Orden de compra eliminada exitosamente', order })
    } catch (error) {
        next(error)
    }
}   

module.exports = { handleGetAllOrders, handleGetOrdersByUserId, handleGetOrderByOrderId, handleCreateOrder, handleUpdateOrderStatus, handleDeleteOrder }