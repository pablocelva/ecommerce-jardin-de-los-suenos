const { DB } = require('../config/db')
const format = require('pg-format')
const { hashPassword, verifyPassword } = require('../helpers/bcrypt')

const verificarCredenciales = async (email, password) => {
    try {
    
    const user = await exists(email)
    if (!user) {
        return { error: 'El correo no esta registrado' };
    }
    
    const isPasswordValid = verifyPassword(password, user.password)
    if (!isPasswordValid) {
        return { error: 'Credenciales incorrectas' };
    }

    return user

    } catch (error) {
        if (error.message === 'USER_NOT_FOUND') {
            return { error: 'Usuario no encontrado' };  // Puedes personalizar este mensaje
        }
        throw error;
    }
}

const exists = async (email) => {
    try {
        const SQLQuery = format(`
                SELECT * FROM usuarios 
                WHERE email = %L
                `,
                email
            )

        const { rows: [user], rowCount } = await DB.query(SQLQuery)

        return user || null
    } catch (error) {
        throw error
    }
}

const register = async (email, password, rol, lenguage) => {
    try {
        
        const existingUser = await exists(email)

        if (existingUser) {
            return { error: 'El correo ya existe' }
        }

        const passwordHashed = hashPassword(password)

        const SQLQuery = format(`
                INSERT INTO usuarios
                VALUES (DEFAULT, %L, %L, %L, %L) RETURNING *
                `,
                email,
                passwordHashed,
                rol,
                lenguage)

        const { rows: [user] } = await DB.query(SQLQuery)
        return user

    } catch (error) {
        throw error
    }
}

const getUser = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [req.email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ user });
        } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuario' });
        }
};

module.exports = { verificarCredenciales, exists, register, getUser }