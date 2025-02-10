const request = require('supertest')
const app = require('../app')  // Asegúrate de que esta ruta sea correcta
const { DB } = require('../config/db')

describe('API REST de Pedidos', () => {
    
    // Test para obtener todos los pedidos
    it('Debería devolver todos los pedidos (GET /api/pedidos)', async () => {
        const res = await request(app).get('/api/pedidos')

        expect(res.status).toBe(200)
        expect(res.body).toBeInstanceOf(Array)
        expect(res.body.length).toBeGreaterThan(0)  // Se espera al menos un pedido
    })

    // Test para obtener los pedidos de un usuario por ID
    it('Debería devolver los pedidos de un usuario por ID (GET /api/pedidos/:id_usuario)', async () => {
        const userId = 2  // Asegúrate de usar un ID válido de tu base de datos
        const res = await request(app).get(`/api/pedidos/${userId}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id_usuario', userId)
    })

    // Test para crear un nuevo pedido
    it('Debería crear un nuevo pedido (POST /api/pedidos)', async () => {
        const newOrder = {
        id_usuario: 2,
        precio_total: 50,
        detalle: [{ id_producto: 1, cantidad: 1, precio_unitario: 50 }],
        direccion: 'Calle Falsa 123',
        }

        const res = await request(app).post('/api/pedidos').send(newOrder)

        expect(res.status).toBe(201)
        expect(res.body).toHaveProperty('id_compra')
        expect(res.body).toHaveProperty('id_usuario', newOrder.id_usuario)
        expect(res.body).toHaveProperty('precio_total', newOrder.precio_total)
    })

    // Test para actualizar el estado de un pedido
    it('Debería actualizar el estado de un pedido (PUT /api/pedidos/:id_compra)', async () => {
        const orderId = 5  // Asegúrate de usar un ID de compra válido
        const updatedStatus = { estado: 'shipped' }

        const res = await request(app).put(`/api/pedidos/${orderId}`).send(updatedStatus)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('estado', updatedStatus.estado)
    })

    // Test para eliminar un pedido
    it('Debería eliminar un pedido (DELETE /api/pedidos/:id_compra)', async () => {
        const orderId = 5  // Asegúrate de usar un ID de compra válido
        const res = await request(app).delete(`/api/pedidos/${orderId}`)

        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('id_compra', orderId)
    })
})
