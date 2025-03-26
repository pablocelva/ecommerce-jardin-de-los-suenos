const swaggerJSDoc = require('swagger-jsdoc');
const schemas = require('./swaggerSchemas');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API del ecommerce',
            version: '1.0.0',
            description: 'Documentación API con swagger'
        },
        components: {
            securitySchemas: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            },
            schemas,
        },
        paths: {},
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJSDoc(options);

exports.specs = specs;

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