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
            usuario: {
                id_usuario: user.id_usuario,
                email: user.email,
                nombre: user.nombre,
                apellido: user.apellido,
                direccion: user.direccion,
                telefono: user.telefono,
                rol: user.rol || 'cliente'
            }
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
            return res.status(400).json({ error: 'Password inválido' })
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

        // Generar token
        const token = signToken({ email: newUser.email })

        // Respuesta con token y datos del usuario
        return res.status(201).json({
            token,
            usuario: {
                id_usuario: newUser.id_usuario,
                email: newUser.email,
                nombre: newUser.nombre,
                apellido: newUser.apellido,
                direccion: newUser.direccion,
                telefono: newUser.telefono,
                rol: newUser.rol || 'cliente'
            }
        })
        
    } catch (error) {
        if (error.message === 'Correo ya registrado') {
            return res.status(409).json({
                id: 'correoDuplicado',
                message: 'El correo ya está registrado'
            })
        }
        console.log(error)
        next(error)
    }
}

const handleGetUserById = async (req, res, next) => {
    try {
        //const { email } = req.user
        //const userData = await usuarios.exists(email)
        const { id } = req.params
        const userData = await usuarios.exists(id)
        console.log(userData);
        if (!userData) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            email: userData.email,
            nombre: userData.nombre,
            apellido: userData.apellido,
            direccion: userData.direccion,
            telefono: userData.telefono
        });

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.log(error)
            return res.status(401).json({ error: 'Token expirado' });
        }
        console.log(error)
        next(error)
    }
}

const handleGetUsers = async (req, res, next) => {
    try {
        const users = await usuarios.getAllUsers()
        res.status(200).json(users)
    } catch (error) {
        next(error)
    }
}

const handleUpdateUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const { email, password, nombre, apellido, direccion, telefono } = req.body

        if (!email || !password || !nombre || !apellido || !direccion || !telefono) {
            return res.status(400).json({ error: 'Faltan datos' })
        }

        const user = await usuarios.updateUser(id, email, password, nombre, apellido, direccion, telefono)

        console.log(user)
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        //res.status(200).json(user)
        return res.status(200).json({
            message: 'Usuario actualizado correctamente',
            user: {
                email: user.email,
                password: user.password,
                nombre: user.nombre,
                apellido: user.apellido,
                direccion: user.direccion,
                telefono: user.telefono
            }
        });
    } catch (error) {
        next(error)
    }
}

const handleDeleteUser = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await usuarios.deleteUser(id)

        if (!result) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado correctamente' })
    } catch (error) {
        next(error)
    }
}

module.exports = { handleLogin, handleRegister, handleGetUserById, handleGetUsers, handleUpdateUser, handleDeleteUser }