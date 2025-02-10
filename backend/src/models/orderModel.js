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

const createOrder = async (id_usuario, precio_total, detalle, direccion, estado = 'pending') => {
    try {
        const SQLQuery = format(`
                INSERT INTO orders 
                VALUES (DEFAULT, %L, %L, %L, %L) RETURNING *
                `,
                id_usuario,
                precio_total,
                detalle,
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
                WHEN $1 = 'shipped' THEN NOW() 
                ELSE fecha_envio END
                WHERE id_compra = %L
                RETURNING *
                `,
                estado,
                id_compra
            )

        const { rows: [order] } = await DB.query(SQLQuery)
        return order
    } catch (error) {
        throw error
    }
}

const deleteOrder = async (id_compra, id_usuario) => {
    try {
        const SQLQuery = format(`
                DELETE FROM orders
                WHERE id_compra = %L AND id_usuario = %L
                RETURNING *
                `,
                id_compra,
                id_usuario
            )

        const { rows: [order] } = await DB.query(SQLQuery)
        return order
    } catch (error) {
        throw error
    }
}

module.exports = { getAllOrders, getOrdersByUserId, createOrder, updateOrderStatus, deleteOrder }