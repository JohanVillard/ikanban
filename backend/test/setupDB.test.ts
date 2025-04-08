import pkg from 'pg';
import * as dotenv from 'dotenv';
import { log } from 'node:console';
dotenv.config();

const adminConfig = {
	user: process.env.DB_ADMIN,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	database: 'postgres'
};

const testConfig = {
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	database: 'ikanban_test'
}

const { Client } = pkg;

export async function createRole(dbUser: string, dbPassword: string) {
	const client = new Client(adminConfig);
	await client.connect();

	try {
		// Vérifier si le rôle existe déjà pour éviter une erreur
		const res = await client.query("SELECT 1 FROM pg_roles WHERE rolname = $1", [dbUser]);

		if (res.rows.length === 0) {
			console.log("Création de l'utilisateur de la BDD de test...");
			await client.query(`CREATE ROLE ${dbUser} WITH LOGIN PASSWORD '${dbPassword.replace(/'/g, "''")} '`);

			console.log("Permissions de créé la BDD...");
			await client.query(`ALTER ROLE ${dbUser} CREATEDB`);

			console.log(`Rôle ${dbUser} créé avec succès`);
		} else {
			console.log(`Le rôle ${dbUser} existe déjà`);
		}
	} catch (error) {
		console.error("Erreur lors de la création de l'utilisateur : ", error);
	} finally {
		await client.end();
	}
}

export async function createTestDB(dbName: string, dbUser: string) {
	const client = new Client(adminConfig);
	await client.connect();

	try {
		// Drop & Create pour être sûr d’avoir une base clean
		await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
		await client.query(`CREATE DATABASE ${dbName} OWNER ${dbUser}`);
		console.log("La base de données a été créée avec succès.");


	} catch (error) {
		console.error("Erreur lors de la création de la base de données :", error)
	} finally {
		await client.end();
	}
}

export async function giveDBPermissions(dbUser: string, db: string) {
	const client = new Client(adminConfig);
	await client.connect();

	try {
		await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${db} TO ${dbUser}`);

		// Accord des privilèges d'usage et de création sur le schéma public
		await client.query(`GRANT USAGE, CREATE ON SCHEMA public TO ${dbUser}`);

		// Accorder des privilèges sur toutes les tables existantes
		await client.query(`GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO ${dbUser}`);

		// Définir les privilèges par défaut pour toutes les tables futures
		await client.query(`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO ${dbUser}`);

		console.log(`Privilèges accordés à ${dbUser} avec succès`);
	} catch (error) {
		console.error("Erreur lors de l'attribution des permissions: ", error);
	} finally {
		await client.end();
	}
}





export async function createTables(dbUser: string, db: string) {
	const client = new Client(testConfig);
	await client.connect();

	await client.query(`GRANT ALL PRIVILEGES ON DATABASE ${db} TO ${dbUser}`);

	try {
		console.log('Création de l\'extension uuid-ossp...');
		await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

		console.log('Création de la table users...');
		await client.query('CREATE TABLE IF NOT EXISTS users (id UUID NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL, PRIMARY KEY (id))');
		await checkTableExists(client, 'users');

		console.log('Création de la table boards...');
		await client.query('CREATE TABLE IF NOT EXISTS boards (id UUID NOT NULL, user_id UUID NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)');

		console.log('Création de la table columns...');
		await client.query('CREATE TABLE IF NOT EXISTS columns (id UUID NOT NULL, board_id UUID NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_board FOREIGN KEY(board_id) REFERENCES boards(id) ON DELETE CASCADE)');


		console.log('Création de la table tasks...');
		await client.query('CREATE TABLE IF NOT EXISTS tasks (id UUID NOT NULL, column_id UUID NOT NULL, name VARCHAR(100) NOT NULL, description VARCHAR(2000), PRIMARY KEY (id), CONSTRAINT fk_column FOREIGN KEY(column_id) REFERENCES columns(id) ON DELETE CASCADE)');

		console.log('Les tables ont été créées avec succès.');

	} catch (error) {
		console.error("Erreur lors de la création des tables: ", error);
	} finally {
		await client.end();
	}
}

async function checkTableExists(client: pkg.Client, tableName: string) {
	try {
		const res = await client.query(`
			SELECT to_regclass('public.${tableName}');
			`);
		if (res.rows[0].to_regclass) {
			console.log(`La table "${tableName}" a été créée avec succès.`);
		} else {
			console.log(`La table "${tableName}" n'a pas pu être créée.`);
		}
	} catch (error) {
		console.error(`Erreur lors de la vérification de la table "${tableName}": `, error);
	}
}

export async function dropTestDB(dbName: string) {
	const client = new Client(adminConfig);
	await client.connect();

	try {
		console.log("Suppression de la BDD...");
		await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
	} catch (error) {
		console.error(`Erreur lors de la suppression de ${dbName}`);
	} finally {
		await client.end();
	}
}

export async function deleteRole(userName: string) {
	const client = new Client(adminConfig);

	try {
		await client.connect();

		console.log("Révocation de tous les privilèges de l'utilisateur test...");
		await client.query(`REVOKE ALL PRIVILEGES ON DATABASE ${adminConfig.database} FROM ${userName}`);
		await client.query(`REVOKE ALL PRIVILEGES ON SCHEMA public FROM ${userName}`);
		await client.query(`REVOKE ALL PRIVILEGES ON ALL TABLES IN SCHEMA public FROM ${userName}`);
		await client.query(`REVOKE ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public FROM ${userName}`);
		await client.query(`REVOKE ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public FROM ${userName}`);

		console.log("Transfert des privilèges restant à Postgres...");
		await client.query(`REASSIGN OWNED BY ${userName} TO postgres`);
		await client.query(`DROP OWNED BY ${userName}`)


		console.log("Suppression de l'utilisateur...");
		await client.query(`DROP ROLE ${userName}`);
		console.log(`L'utilisateur ${userName} a été supprimé avec succès.`);

	} catch (error) {
		console.error(`Erreur en supprimant ${userName}:`, error);
	} finally {
		await client.end();
	}
}

