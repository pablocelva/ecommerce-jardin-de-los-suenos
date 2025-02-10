const { DB } = require('../config/db')
const format = require('pg-format')

const getAllOrders = async () => {
    try {
        const { rows } = await DB.query('SELECT * FROM orders')
        return rows
    } catch (error) {
        throw error
    }
}

const getOrdersByUserId = async (id_usuario) => {
    try {
        const SQLQuery = format(`
                SELECT * FROM orders
                WHERE id_usuario = %L
                ORDER BY fecha_compra DESC
                `,
                id_usuario
            )

        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const getOrderByOrderId = async (id_compra) => {
    try {
        const SQLQuery = format(`
                SELECT * FROM orders
                WHERE id_compra = %L
                `,
                id_compra
            )

        const { rows: [order] } = await DB.query(SQLQuery)
        return order
    } catch (error) {
        throw error
    }
}

const createOrder = async (id_usuario, precio_total, detalle, direccion, estado = 'pending') => {
    try {
        const SQLQuery = format(`
                INSERT INTO orders (id_usuario, precio_total, detalle, direccion, estado)
                VALUES (%L, %L, %L::jsonb, %L, %L)
                RETURNING *
                `,
                id_usuario || null,
                precio_total,
                JSON.stringify(detalle),
                direccion,
                estado
            )

        const { rows: [order] } = await DB.query(SQLQuery)
        return order
    } catch (error) {
        throw error
    }
}

const updateOrderStatus = async (id_compra, estado) => {
    try {
        const SQLQuery = format(`
                UPDATE orders
                SET estado = %L,
                    fecha_envio = CASE 
                        WHEN %L = 'shipped' THEN now()
                        ELSE fecha_envio 
                    END
                WHERE id_compra = %L
                RETURNING *
                `,
                estado,
                estado,
                id_compra
            )

        const { rows: [order] } = await DB.query(SQLQuery)
        return order
    } catch (error) {
        throw error
    }
}

const deleteOrder = async (id_compra) => {
    try {
        const SQLQuery = format(`
                DELETE FROM orders
                WHERE id_compra = %L 
                RETURNING *
                `,
                id_compra,
            )
        /*let SQLQuery;

        if (isAdmin) {
            // Si es admin, puede eliminar cualquier orden
            SQLQuery = format(`
                DELETE FROM orders
                WHERE id_compra = %L
                RETURNING *
                `, id_compra);
        } else {
            // Si no es admin, solo puede eliminar sus propias órdenes
            SQLQuery = format(`
                DELETE FROM orders
                WHERE id_compra = %L AND id_usuario = %L
                RETURNING *
                `, id_compra, id_usuario);
        }*/

        const { rows: [order] } = await DB.query(SQLQuery)

        if (!order) {
            throw new Error('No se encontró la orden')
        }
        return order
    } catch (error) {
        throw error
    }
}

module.exports = { getAllOrders, getOrdersByUserId,getOrderByOrderId, createOrder, updateOrderStatus, deleteOrder }