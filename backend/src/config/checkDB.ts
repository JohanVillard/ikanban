import config from './config';
import pool from './connectDB';

async function checkDB() {
    try {
        // Vérifier si la base de données existe
        const dbCheckResult = await pool.query(
            `SELECT 1 FROM pg_database WHERE datname = $1`,
            [config.db.database],
        );

        const dbExists = dbCheckResult.rows.length > 0;

        if (dbExists) {
            console.log(`Connecté à ${config.db.database}.`);
        } else {
            console.warn(
                "La base de données n'existe pas. Vous devez la créer. Reportez-vous au README.md du projet.",
            );
        }
    } catch (error) {
        console.error('Erreur en se connectant à la base de données.', error);
    }
}

export default checkDB;
