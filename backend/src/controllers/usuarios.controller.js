const { hashPassword, verifyPassword } = require('../helpers/bcrypt')
const { signToken, verifyToken, decodeToken, getHeadersToken } = require('../helpers/jwt')
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
            rol: user.rol,
            lenguage: user.lenguage,
        });
        
    } catch (error) {
        console.log(error)
        next(error)
    }
}

const handleRegister = async (req, res, next) => {
    try {
        const { email, password, rol, lenguage } = req.body

        // Verificaciones
        if (!validateEmail(email)) {
            return res.status(400).json({ error: 'Formato de correo inválido' })
        }

        if (!password) {
            return res.status(400).json({ error: 'password inválido' })
        }

        if (!rol || rol === 'Seleccione un rol') {
            return res.status(400).json({ error: 'Rol inválido' })
        }

        if (!lenguage || lenguage === 'Seleccione un Lenguage') {
            return res.status(400).json({ error: 'Lenguage inválido' })
        }

        const passwordHashed = hashPassword(password)

        const newUser = await usuarios.register(email, passwordHashed, rol, lenguage)

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
            rol: userData.rol,
            lenguage: userData.lenguage
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