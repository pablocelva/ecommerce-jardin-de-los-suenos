const {verificarCredenciales, exists, register, getUser} = require('../../models/usuariosModel')

const { DB } = require('../../config/db')

jest.mock('../../config/db')

describe('AUTH MODEL TESTS', () => {
    beforeEach(() => {
        jest.clearAllMocks()
    })

    describe('Verificar credenciales', () => {
        test('Usuario encontrado', async () => {
            const email = 'test@test.com'
            const password = 'hashedPassword'

            const userMock = {
                id: 1,
                email,
                password,
            }

            DB.query.mockResolvedValue({rows:[userMock], rowCount: 1})

            const result = await verificarCredenciales(email, password)

            //expect(result).toBe(true)
            expect(result).toEqual(userMock)
            expect(DB.query).toHaveBeenCalledTimes(1)
        })
        test('Usuario no encontrado', async () => {
            const email = 'test@test.com'
            const password = 'hashedPassword'

            DB.query.mockResolvedValue({rows:[], rowCount: 0})
            await expect(verificarCredenciales(email, password))
            .rejects
            .toThrow('El correo no esta registrado')
            expect(DB.query).toHaveBeenCalledTimes(2)
        })
    })

    describe('Register', () => {
        test('Registro exitoso', async () => {
            const email = 'test@example.com'
            const password = 'hashedPassword'

            const mockUser = {
                id: 2,
                email,
                password,
            }

            DB.query.mockResolvedValue({
                rows:[mockUser], 
                rowCount: 1
            })

            const user = await register(email, password)

            expect(user).toEqual(mockUser)
            expect(DB.query).toHaveBeenCalledTimes(1)
        })
        test('Error en el registro', async () => {
            const email = 'test@example.com'
            const password = 'hashedPassword'

            //DB.query.mockResolvedValue({new Error('DATABASE_ERROR')})

            await expect(register(email, password))
            .rejects
            .toThrow('DATABASE_ERROR')
        })
    })
    describe('exists', () => {
        test('Usuario encontrado', async () => {
            const email = 'test@example.com'

            const userMock = {
                id: 1,
                email,
            }

            DB.query.mockResolvedValue({
                rows:[userMock], 
                rowCount: 1
            })

            const user = await exists(email)

            expect(user).toEqual(userMock)
            expect(DB.query).toHaveBeenCalledTimes(1)
        })
        test('Usuario no encontrado', async () => {
            const email = 'notExist@example.com'

            DB.query.mockResolvedValue({
                rowCount: 0,
                rows:[]
            })
            await expect(exists(email))
            .rejects
            .toThrow('USER_NOT_FOUND')
            //expect(DB.query).toHaveBeenCalledTimes(1)
        })
    })
})

