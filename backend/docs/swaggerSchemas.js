const schemas = {
    Usuario: {
        type: 'object',
        properties: {
            id_usuario: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            email: {
                type: 'string',
                example: 'test@example.com',
            },
            password: {
                type: 'string',
                example: 'hashedPassword',
            },
            nombre: {
                type: 'string',
                example: 'Juan',
            },
            apellido: {
                type: 'string',
                example: 'Pérez',
            },
            direccion: {
                type: 'string',
                example: '123 Main St, New York',
            },
            telefono: {
                type: 'string',
                example: '+1234567890',
            },
            rol: {
                type: 'string',
                example: 'admin',
            },
            imagen_perfil: {
                type: 'string',
                example: 'https://example.com/juan-profile.jpg',
            },
            fecha_creacion: {
                type: 'string',
                example: '2025-01-28T12:00:00',
            },
        },
        required: ['id_usuario', 'email', 'password', 'nombre', 'apellido', 'direccion', 'telefono', 'rol', 'imagen_perfil', 'fecha_creacion'],
    },
    Producto: {
        type: 'object',
        properties: {
            id_producto: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            nombre_producto: {
                type: 'string',
                example: 'Monstera Deliciosa',
            },
            descripcion: {
                type: 'string',
                example: 'Planta de interior popular con hojas grandes y vistosas.',
            },
            precio: {
                type: 'number',
                format: 'float',
                example: 25.99,
            },
            stock: {
                type: 'integer',
                format: 'int64',
                example: 10,
            },
            fecha_creacion: {
                type: 'string',
                example: '2025-01-28T12:00:00',
            },
        },
        required: ['id_producto', 'nombre_producto', 'descripcion', 'precio', 'stock', 'fecha_creacion'],
    },
    Categoria: {
        type: 'object',
        properties: {
            id_categoria: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            nombre_categoria: {
                type: 'string',
                example: 'Plantas de Interior',
            },
        },
        required: ['id_categoria', 'nombre_categoria'],
    },
    ImagenProducto: {
        type: 'object',
        properties: {
            id_imagen: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            url: {
                type: 'string',
                example: 'https://images.unsplash.com/photo-1530049478161-0780526964f4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
            },
        },
        required: ['id_imagen', 'url'],
    },
    Pedido: {
        type: 'object',
        properties: {
            id_compra: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            id_usuario: {
                type: 'integer',
                format: 'int64',
                example: 1,
            },
            precio_total: {
                type: 'number',
                format: 'float',
                example: 64.97,
            },
            detalle: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        id_producto: {
                            type: 'integer',
                            format: 'int64',
                            example: 1,
                        },
                        nombre_producto: {
                            type: 'string',
                            example: 'Monstera Deliciosa',
                        },
                        cantidad: {
                            type: 'integer',
                            format: 'int64',
                            example: 2,
                        },
                        precio_unitario: {
                            type: 'number',
                            format: 'float',
                            example: 25.99,
                        },
                        subtotal: {
                            type: 'number',
                            format: 'float',
                            example: 51.98,
                        },
                    },
                    required: ['id_producto', 'nombre_producto', 'cantidad', 'precio_unitario', 'subtotal'],
                },
            },
            direccion: {
                type: 'string',
                example: 'Dirección de Ana Martínez',
            },
            estado: {
                type: 'string',
                example: 'pending',
            },
            fecha_compra: {
                type: 'string',
                example: '2025-01-28T14:00:00',
            },
            fecha_envio: {
                type: 'string',
                example: '2025-01-28T14:30:00',
            },
        },
        required: ['id_compra', 'id_usuario', 'precio_total', 'detalle', 'direccion', 'estado', 'fecha_compra', 'fecha_envio'],
    },
    Error: {
        type: 'object',
        properties: {
            message: {  
                type: 'string',
                example: 'El correo no esta registrado',
            },
            code: {  
                type: 'integer',
                example: 404,
            },
        },
        required: ['error'],
    },
};