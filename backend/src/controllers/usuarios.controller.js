const { hashPassword, verifyPassword } = require('../helpers/bcrypt')
const { signToken } = require('../helpers/jwt')
const usuarios = require('../models/usuariosModel')
const { validateEmail } = require('../helpers/validateEmail')

const handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body
        
        // Verificaciones
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' })
        }
        
        if (!password) {
            return res.status(400).json({ error: 'password inválido' })
        }

        const user = await usuarios.verificarCredenciales(email, password)
        
        if (user.error) {
            return res.status(400).json({ error: user.error })
        }

        const token = signToken({ email: user.email })

        return res.status(200).json({
            token,
            email: user.email,
            nombre: user.nombre,
            apellido: user.apellido,
            direccion: user.direccion,
            telefono: user.telefono
        });
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const handleRegister = async (req, res, next) => {
    try {
        const { email, password, nombre, apellido, direccion, telefono } = req.body

        // Verificaciones
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' })
        }

        if (!password) {
            return res.status(400).json({ error: 'password inválido' })
        }

        if (!nombre || nombre === 'Nombre inválido') {
            return res.status(400).json({ error: 'Nombre inválido' })
        }

        if (!apellido || apellido === 'Apellido inválido') {
            return res.status(400).json({ error: 'Apellido inválido' })
        }

        if (!direccion || direccion === 'Dirección inválida') {
            return res.status(400).json({ error: 'Dirección inválida' })
        }

        if (!telefono || telefono === 'Teléfono inválido') {
            return res.status(400).json({ error: 'Teléfono inválido' })
        }

        const passwordHashed = hashPassword(password)

        const newUser = await usuarios.register(email, passwordHashed, nombre, apellido, direccion, telefono)

        res.status(201).json(newUser)
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const getUser = async (req, res, next) => {
    try {
        const { email } = req.user
        const userData = await usuarios.exists(email)

        if (!userData) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json([{
            email: userData.email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            direccion: userData.direccion,
            telefono: userData.telefono
        }]);

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log(error)
            return res.status(401).json({ error: 'Token expirado' });
        }
        console.log(error)
        next(error)
    }
}

module.exports = { handleLogin, handleRegister, getUser }