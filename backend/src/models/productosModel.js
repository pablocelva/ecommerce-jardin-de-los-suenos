const { DB } = require('../config/db')
const format = require('pg-format')

const getAllProducts = async () => {
    try {
        const { rows } = await DB.query('SELECT * FROM productos')
        return rows
    } catch (error) {
        throw error
    }
}

const getProductById = async (id) => {
    try {
        const result = await DB.query('SELECT * FROM productos WHERE id_producto = $1', [id])
        const product = result.rows[0];

        return product
        } catch (error) {
        throw error
    }
}

const createProduct = async (nombre_producto, descripcion, precio, stock) => {
    try {
        const SQLQuery = format(`
                INSERT INTO productos
                VALUES (DEFAULT, %L, %L, %L, %L) RETURNING *
                `,
                nombre_producto,
                descripcion,
                precio,
                stock
            )

        const { rows: [user] } = await DB.query(SQLQuery)
        return user

    } catch (error) {
        throw error
    }
}

const updateProduct = async (id, nombre_producto, descripcion, precio, stock) => {
    try {
        const SQLQuery = format(`
                UPDATE productos
                SET nombre_producto = %L,
                descripcion = %L,
                precio = %L,
                stock = %L
                WHERE id_producto = %L
                RETURNING *
                `,
                nombre_producto,
                descripcion,
                precio,
                stock,
                id
            )

        const { rows: [user] } = await DB.query(SQLQuery)
        return user
    } catch (error) {
        throw error
    }
}

const deleteProduct = async (id) => {
    try {
        const SQLQuery = format(`
                DELETE FROM productos
                WHERE id_producto = %L
                RETURNING id_producto
                `,
                id
            )

        const { rows: [user] } = await DB.query(SQLQuery)
        return user
    } catch (error) {
        throw error
    }
}

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct }