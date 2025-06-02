import dotenv from 'dotenv';
import path from 'path';

const env = process.env.NODE_ENV || 'development';

// Utilisation de import.meta.url pour simuler __dirname
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// charger les variables d'environnement
const envFile = path.resolve(__dirname, `../../.env.${env}`);
dotenv.config({ path: envFile });
console.log('Env loaded:', envFile);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('DB_NAME:', process.env.DB_NAME);

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
    jwt_secret: string;
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
    jwt_secret: process.env.JWT_SECRET || '',
};

export default config;
