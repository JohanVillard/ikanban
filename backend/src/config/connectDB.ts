import pkg from 'pg';
import config from './config.js';

const { Pool } = pkg;

const pool = new Pool({
	user: config.db.user,
	host: config.db.host,
	port: config.db.port,
	password: config.db.password,
	database: config.db.database,
});

export default pool;
