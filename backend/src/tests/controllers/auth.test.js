const { handleLogin, handleRegister } = require('../../controllers/usuarios.controller')
const auth = require('../../models/usuariosModel')
const { hashPassword, verifyPassword } = require('../../helpers/bcrypt')
const { signToken, verifyToken, decodeToken, getHeadersToken } = require('../../helpers/jwt')
const { DB } = require('../../config/db')

jest.mock('../../config/db')
jest.mock('../../helpers/bcrypt')
jest.mock('../../helpers/jwt')

describe('AUTH CONTROLLER TESTS', () => {
    let req, res, next
    beforeEach(() => {
        req = {}
        res = {
            json: jest.fn(),
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        }
        next = jest.fn()
    })

    describe('handleLogin', () => {
        
        test('Login exitoso', async () => {
            const email = 'test@example.com'
            const hashedPassword = 'hasedPassword'
            const password = '123456987'
            req.body ={
                email,
                password,
            }
            auth.exists.mockResolvedValue({
                id: 1,
                email,
                password: hashedPassword,
            })
            verifyPassword.mockReturnValue(true)
            signToken.mockReturnValue('token_jwt')
            
            await handleLogin(req, res, next)
            
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ token: 'token_jwt' });

            //expect(auth.exists).toHaveBeenCalledWith(email)
            //expect(verifyPassword).toHaveBeenCalledWith(password, hashedPassword)
            //expect(signToken).toHaveBeenCalledWith({ email })
            //expect(res.status).toHaveBeenCalledWith(200)
        })
    })
})
