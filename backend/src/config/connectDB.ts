import pg from 'pg';
import config from './config.js';

const { Pool } = pg;

/**
 * Création d’un pool de connexions PostgreSQL.
 * Utilise la configuration définie dans le fichier config.js.
 */
const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    port: config.db.port,
    password: config.db.password,
    database: config.db.database,
});

export default pool;
