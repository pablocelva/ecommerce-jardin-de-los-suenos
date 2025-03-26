const { addSwaggerPath } = require('../swaggerConfig');
const { Router } = require('express');
const { handleLogin, handleRegister, handleGetUsers, handleGetUserById, handleUpdateUser, handleDeleteUser } = require('../../controllers/usuarios.controller');
const { verifyTokenMiddleware } = require('../../helpers/jwt');

const router = Router();

addSwaggerPath('/api/usuarios', 'post', { 
    tags: ['Usuarios'], 
    summary: 'Registrar usuario', 
    description: 'Registra un nuevo usuario en la base de datos.', 
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
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
                    },
                    required: ['email', 'password', 'nombre', 'apellido', 'direccion', 'telefono'],
                },
            },
        },
    }, 
    responses: {
        201: {
            description: 'Usuario creado correctamente',
            content: {
                'application/json': {
                    schema: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
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
                },
            }
        },
        400: {
            description: 'Faltan campos obligatorios',
            content: {
                'application/json': {
                    schema: {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
                        type: 'object',
                        properties: {
                            message: {  
                                type: 'string',
                                example: 'Faltan campos obligatorios',
                            },
                            code: {  
                                type: 'integer',
                                example: 400,
                            },
                        },
                        required: ['message', 'code'],
                    },
                },
            },                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
        },
    },
});

const addSwaggerPath = (path, method, config, requiresAuth = false) => {
    if (!specs.paths[path]) {
        specs.paths[path] = {};
    }

    if (requiresAuth) {
        config.security = [{ bearerAuth: [] }];
    }
    
    specs.paths[path][method] = config;
};

module.exports = { 
    specs, 
    addSwaggerPath 
};  