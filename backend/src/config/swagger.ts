import swaggerJSDoc from 'swagger-jsdoc';
import config from './config';

const swaggerOptions = {
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'API iKanban',
			version: '1.0.0',
			description: "Documentation de l'API iKanban",
		},
		servers: [
			{
				url: `http://localhost:${config.server.port}/api`,
			},
		],
	},
	apis: ['./src/routes/*.ts'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
