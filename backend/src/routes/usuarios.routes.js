const { Router } = require('express')
const { handleLogin, handleRegister, handleGetUsers, handleGetUserById, handleUpdateUser, handleDeleteUser } = require('../controllers/usuarios.controller')
const { verifyTokenMiddleware } = require('../helpers/jwt')
const router = Router()

router.post('/registro', handleRegister)
router.post('/login', handleLogin)
router.get('/usuarios/', verifyTokenMiddleware, handleGetUsers)
router.get('/usuarios/:id', verifyTokenMiddleware, handleGetUserById)
router.put('/usuarios/:id', verifyTokenMiddleware, handleUpdateUser)
router.delete('/usuarios/:id', verifyTokenMiddleware, handleDeleteUser)

module.exports = router