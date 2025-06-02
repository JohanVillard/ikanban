import pkg from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();

const adminConfig = {
    user: 'postgres',
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: 'postgres',
};

const testConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
};

const { Client } = pkg;

export async function createTestDB(dbName: string, dbUser: string) {
    const client = new Client(adminConfig);
    await client.connect();

    try {
        // 1. Créer l'utilisateur s'il n'existe pas
        const userExists = await client.query(
            `SELECT 1 FROM pg_roles WHERE rolname = $1`,
            [dbUser]
        );

        if (userExists.rows.length === 0) {
            await client.query(
                `CREATE USER ${dbUser} WITH PASSWORD '${process.env.DB_PASSWORD}'`
            );
            await client.query(`ALTER USER ${dbUser} CREATEDB`);
            console.log(`Utilisateur ${dbUser} créé avec succès.`);
        }

        // Drop & Create pour être sûr d’avoir une base clean
        await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName} OWNER ${dbUser}`);
        console.log('La base de données a été créée avec succès.');
    } catch (error) {
        console.error(
            'Erreur lors de la création de la base de données :',
            error
        );
    } finally {
        await client.end();
    }
}

export async function createTables(dbUser: string, db: string) {
    const client = new Client(testConfig);
    await client.connect();

    try {
        console.log("Création de l'extension uuid-ossp...");
        await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

        console.log('Création de la table users...');
        await client.query(
            'CREATE TABLE IF NOT EXISTS users (id UUID NOT NULL, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL UNIQUE, password_hash VARCHAR(100) NOT NULL, PRIMARY KEY (id))'
        );
        await checkTableExists(client, 'users');

        console.log('Création de la table boards...');
        await client.query(
            'CREATE TABLE IF NOT EXISTS boards (id UUID NOT NULL, user_id UUID NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)'
        );

        console.log('Création de la table columns...');
        await client.query(
            'CREATE TABLE IF NOT EXISTS columns (id UUID NOT NULL, board_id UUID NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY (id), CONSTRAINT fk_board FOREIGN KEY(board_id) REFERENCES boards(id) ON DELETE CASCADE)'
        );

        console.log('Création de la table tasks...');
        await client.query(
            'CREATE TABLE IF NOT EXISTS tasks (id UUID NOT NULL, column_id UUID NOT NULL, name VARCHAR(100) NOT NULL, description VARCHAR(2000), PRIMARY KEY (id), CONSTRAINT fk_column FOREIGN KEY(column_id) REFERENCES columns(id) ON DELETE CASCADE)'
        );

        console.log('Les tables ont été créées avec succès.');
    } catch (error) {
        console.error('Erreur lors de la création des tables: ', error);
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
        console.error(
            `Erreur lors de la vérification de la table "${tableName}": `,
            error
        );
    }
}

export async function dropTestDB(dbName: string) {
    const client = new Client(adminConfig);
    await client.connect();

    try {
        console.log('Suppression de la BDD...');
        await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de ${dbName}`);
    } finally {
        await client.end();
    }
}
