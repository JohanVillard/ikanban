import swaggerJSDoc from 'swagger-jsdoc';
import config from './config.js';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API iKanban',
            version: '1.0.0',
            description: "Documentation de l'API iKanban",
        },
        servers: [
            {
                url: `http://localhost:${config.server.port}/api/v1`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/api/v1/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
