import config from '../src/config/config.js';
import { pool } from './1-database.test.js';
import { dropTestDB } from './setupDB.js';

describe("Nettoyage des tests", function() {
	this.timeout(6000);

	it("doit nettoyer toutes les données de tests", async () => {
		console.log('Fermeture de toute les connexions.')
		await pool.end();

		await dropTestDB(config.db.database);

		console.log("Nettoyage terminée.");

	})
});
