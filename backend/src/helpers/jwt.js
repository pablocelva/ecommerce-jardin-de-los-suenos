require ('dotenv').config()
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env

const signToken = (data) => {
    return jwt.sign(
        data, 
        String(JWT_SECRET),
        {
            algorithm: 'HS384',
            expiresIn: '24h'
        }
    )
}

const verifyToken = (token) => {
    try {
        if (!token || typeof token !== 'string') {
            throw new Error('Token inválido');
        }
        return jwt.verify(token, JWT_SECRET)
    } catch (error) {
        console.log('Error al verificar el token:', error)
        throw new Error('Token inválido')
    }
}

const verifyTokenMiddleware = (req, res, next) => {
    try {
        const token = getHeadersToken(req)
        const decoded = verifyToken(token)
        req.user = decoded
        next()
    } catch (error) {
        res.status(401).json({ error: 'Token inválido' });
    }
}

const decodeToken = (token) => {
    return jwt.decode(token)
}

const getHeadersToken = (req) => {
    const Authorization = req.header('Authorization')
    if (!Authorization || !Authorization.startsWith('Bearer ')) {
        throw new Error('Token no proporcionado o formato incorrecto');
    } 
    return Authorization.split('Bearer ')[1]
}

module.exports = { 
    signToken, 
    getHeadersToken,
    verifyToken,
    decodeToken,
    verifyTokenMiddleware
}