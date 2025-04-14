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

const getAllImagenes = async () => {
    try {
        const SQLQuery = format(`
            SELECT * FROM imagenes_producto
            `);
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const getImagenesByIdProducto = async (id) => {
    try {
        const SQLQuery = format(`
            SELECT * FROM imagenes_producto WHERE id_producto = %L
            `,
            id
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const addImagenProducto = async (id_producto, url) => {
    try {
        const SQLQuery = format(`
            INSERT INTO imagenes_producto (id_producto, url)
            VALUES (%L, %L)
            `,
            id_producto,
            url
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const getAllCategorias = async () => {
    try {
        const SQLQuery = format(`
            SELECT * FROM categorias
            `);
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const getProductsByCategoria = async (id) => {
    try {
        const SQLQuery = format(`
            SELECT p.* 
            FROM productos p
            JOIN categorias_productos cp ON p.id_producto = cp.id_producto
            JOIN categorias c ON cp.id_categoria = c.id_categoria
            WHERE c.id_categoria = %L
            `,
            id
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const getCategoriasByIdProducto = async (id_producto) => {
    try {
        const SQLQuery = format(`
            SELECT * FROM categorias_productos WHERE id_producto = %L
            `,
            id_producto
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const addProductCategoria = async (id_producto, id_categoria) => {
    try {
        const SQLQuery = format(`
            INSERT INTO categorias_productos
            VALUES (%L, %L)
            `,
            id_producto,
            id_categoria
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const updateProductCategoria = async (id_producto, id_categoria) => {
    try {
        const SQLQuery = format(`
            UPDATE categorias_productos
            SET id_categoria = %L
            WHERE id_producto = %L
            `,
            id_categoria,
            id_producto
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}

const deleteProductCategoria = async (id_producto, id_categoria) => {
    try {
        const SQLQuery = format(`
            DELETE FROM categorias_productos
            WHERE id_producto = %L AND id_categoria = %L
            `,
            id_producto,
            id_categoria
        )
        const { rows } = await DB.query(SQLQuery)
        return rows
    } catch (error) {
        throw error
    }
}


module.exports = { 
    getAllProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct,
    getAllImagenes,
    getImagenesByIdProducto,
    getAllCategorias,
    getProductsByCategoria,
    addProductCategoria,
    updateProductCategoria,
    deleteProductCategoria,
    getCategoriasByIdProducto,
    addImagenProducto,
}