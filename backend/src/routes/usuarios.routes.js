const { Router } = require('express')
const { handleLogin, handleRegister, getUser } = require('../controllers/usuarios.controller')
const { verifyToken, verifyTokenMiddleware } = require('../helpers/jwt')
const router = Router()

router.post('/usuarios', handleRegister)
router.post('/login', handleLogin)
router.get('/usuarios', verifyTokenMiddleware, getUser)

module.exports = router