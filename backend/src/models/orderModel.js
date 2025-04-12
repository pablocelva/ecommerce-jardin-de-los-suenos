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

const createOrder = async (orderData) => {
    const { 
        id_usuario, 
        nombre_cliente, 
        email_cliente, 
        detalle, 
        total, 
        fecha_orden, 
        estado, 
        direccion
    } = orderData;

    try {
        const query = `
            INSERT INTO orders (
                id_usuario, 
                precio_total, 
                detalle, 
                direccion, 
                estado
            ) 
            VALUES ($1, $2, $3, $4, $5) 
            RETURNING *
        `;

        const values = [
            id_usuario,
            total,
            JSON.stringify(detalle),
            direccion,
            estado
        ];

        const result = await DB.query(query, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error en createOrder:', error);
        throw new Error('Error al crear el pedido en la base de datos');
    }
};

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