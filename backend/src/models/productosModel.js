const { DB } = require('../config/db')

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
        const result = await DB.query('SELECT * FROM productos WHERE id = $1', [id])
        const product = result.rows[0];

        if (!product) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.status(200).json({ product });

        } catch (error) {
        res.status(500).json({ error: 'Error al obtener producto' });
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
                WHERE id = %L
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
                WHERE id = %L
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