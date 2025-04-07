import dotenv from 'dotenv';
import path = require('path');

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
console.log(path.resolve(__dirname, '../../../.env'));


interface Config {
	db: {
		host: string;
		port: number;
		user: string;
		password: string;
		database: string;
	};
	server: {
		port: number;
	};
	nodeEnv: string;
}

// Configurer les variables d'environnement
const config: Config = {
	db: {
		host: process.env.DB_HOST || 'localhost',
		port: Number(process.env.DB_PORT),
		user: process.env.DB_USER || '',
		password: process.env.DB_PASSWORD || '',
		database: process.env.DB_NAME || '',
	},
	server: {
		port: Number(process.env.PORT) || 3000,
	},
	nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
