import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV === 'test' ? '.env.test' : 'env';
console.log(`chargement de l'environnement : ${env}`);

// Utilisation de import.meta.url pour simuler __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, `../../../${env}`) });
console.log(`chemin du fichier chargé : ${path.resolve(__dirname, `../../../${env}`)}`);


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
