"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../src/config/config"));
const pool = new pg_1.Pool({
    user: config_1.default.db.user,
    host: config_1.default.db.host,
    database: config_1.default.db.database,
    password: config_1.default.db.password,
    port: config_1.default.db.port,
});
console.log(config_1.default);
describe('Tests de base de données', () => {
    before(async () => {
        await pool.query('DELETE FROM users');
        await pool.query('DELETE FROM boards');
        await pool.query('DELETE FROM columns');
        await pool.query('DELETE FROM tasks');
    });
    it('doit insérer un utilisateur', async () => {
        const result = await pool.query('INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *', ['75a745c9-975f-4826-a263-13d1dbb2eec5', 'tester1', 'tester1@example.com', 'hashed_password']);
        assert_1.default.equal(result.rows[0].name, 'tester1');
        assert_1.default.equal(result.rows[0].email, 'tester1@example.com');
        assert_1.default.equal(result.rows[0].password_hash, 'hashed_password');
    });
    it('doit insérer un second utilisateur', async () => {
        const result = await pool.query('INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3) RETURNING *', ['tester2', 'tester2@example.com', 'hashed_password']);
        assert_1.default.equal(result.rows[0].name, 'tester2');
        assert_1.default.equal(result.rows[0].email, 'tester2@example.com');
        assert_1.default.equal(result.rows[0].password_hash, 'hashed_password');
    });
    it('ne doit pas insérer un utilisateur avec le même mail', async () => {
        try {
            await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING *', ['tester3', 'tester1@example.com', 'hashed_password']);
            // Si aucune erreur n'est levée, on échoue explicitement le test
            // L'unicité du champ mail n'est pas respecté
            assert_1.default.fail("L'erreur attendue n'a pas été détectée");
        }
        catch (error) {
            if (error instanceof Error) {
                // Passe le test si le message d'erreur de violation d'unicité retourné par PostgreSQL
                // correspond exactement à ce que l'on attend dans ce cas
                assert_1.default.ok(error.message.includes("la valeur d'une clé dupliquée rompt la contrainte unique"), `Erreur inattendue : ${error.message}`);
            }
            else {
                // Force le test à échouer dans ce cas, peu de chance...
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it('doit trouver un utilisateur par email', async () => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', ['tester1@example.com']);
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].name, 'tester1');
        assert_1.default.equal(result.rows[0].email, 'tester1@example.com');
    });
    it('ne doit pas trouver un utilisateur par email inexistant', async () => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', ['inexistant@example.com']);
        assert_1.default.equal(result.rowCount, 0);
    });
    it("doit mettre à jour le mail d'un utilisateur existant", async () => {
        const result = await pool.query('UPDATE users SET email = $1 WHERE name = $2 RETURNING *', ['updated-email@example.com', 'tester1']);
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].email, 'updated-email@example.com');
    });
    it("ne doit pas mettre à jour l'email avec un email déjà enregistré pour un autre utilisateur.", async () => {
        try {
            await pool.query('UPDATE users SET email = $1 WHERE name = $2 RETURNING *', ['updated-email@example.com', 'tester2']);
            assert_1.default.fail("L'erreur attendue n'a pas été détectée");
        }
        catch (error) {
            if (error instanceof Error) {
                assert_1.default.ok(error.message.includes("la valeur d'une clé dupliquée rompt la contrainte unique"), `Erreur inattendue : ${error.message}`);
            }
            else {
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it("empêcher l'injection de code SQL", async () => {
        const maliciousEmail = "' OR 1=1 --";
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [maliciousEmail]);
        assert_1.default.equal(result.rowCount, 0);
    });
    it('ne doit pas autoriser la valeur NULL dans le champ du nom', async () => {
        try {
            await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', [null, 'null@example.com', 'hashed_password']);
            assert_1.default.fail('Expected error but got none');
        }
        catch (error) {
            if (error instanceof Error) {
                assert_1.default.ok(error.message.includes('une valeur NULL viole la contrainte NOT NULL'), `Erreur inattendue : ${error.message}`);
            }
            else {
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it('ne doit pas autoriser la valeur NULL dans le champ du mail', async () => {
        try {
            await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', ['null', null, 'hashed_password']);
            assert_1.default.fail('Expected error but got none');
        }
        catch (error) {
            if (error instanceof Error) {
                assert_1.default.ok(error.message.includes('une valeur NULL viole la contrainte NOT NULL'), `Erreur inattendue : ${error.message}`);
            }
            else {
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it('ne doit pas autoriser la valeur NULL dans le champ du mot de passe', async () => {
        try {
            await pool.query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)', ['null', 'null@example.com', null]);
            assert_1.default.fail('Expected error but got none');
        }
        catch (error) {
            if (error instanceof Error) {
                assert_1.default.ok(error.message.includes('une valeur NULL viole la contrainte NOT NULL'), `Erreur inattendue : ${error.message}`);
            }
            else {
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it('doit insérer un board et le récupérer par son ID', async () => {
        const user = await pool.query('SELECT * FROM users WHERE name = $1', [
            'tester1',
        ]);
        const userId = user.rows[0].id;
        const resultInsert = await pool.query('INSERT INTO boards (user_id, name) VALUES ($1, $2) RETURNING *', [userId, 'Projet Test']);
        const boardId = resultInsert.rows[0].id;
        const resultSelect = await pool.query('SELECT * FROM boards WHERE id = $1', [boardId]);
        assert_1.default.equal(resultSelect.rows[0].name, 'Projet Test');
        assert_1.default.equal(resultSelect.rows[0].user_id, userId);
    });
    it("doit mettre à jour le nom d'un board", async () => {
        const board = await pool.query('SELECT * FROM boards WHERE name = $1', [
            'Projet Test',
        ]);
        const boardId = board.rows[0].id;
        const result = await pool.query('UPDATE boards SET name = $1 WHERE id = $2', ['Projet mis à jour', boardId]);
        const updatedBoard = await pool.query('SELECT * FROM boards WHERE id = $1', [boardId]);
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(updatedBoard.rows[0].name, 'Projet mis à jour');
    });
    it('doit insérer une colonne', async () => {
        const board = await pool.query('SELECT * FROM boards WHERE name = $1', [
            'Projet mis à jour',
        ]);
        const boardId = board.rows[0].id;
        await pool.query('INSERT INTO columns (board_id, name) VALUES ($1, $2)', [boardId, 'En cours']);
        const result = await pool.query('SELECT * FROM columns WHERE board_id = $1 AND name = $2', [boardId, 'En cours']);
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].name, 'En cours');
    });
    it('ne doit pas insérer une colonne sans board_id valide', async () => {
        try {
            const invalidUUID = (0, uuid_1.v4)();
            await pool.query('INSERT INTO columns (board_id, name) VALUES ($1, $2)', [invalidUUID, 'En attente']);
            assert_1.default.fail("L'insertion devrait échouer avec un board_id invalide.");
        }
        catch (error) {
            if (error instanceof Error) {
                // On normalise le message d'erreur sinon la comparaison ne fonctionne pas
                const cleanMessage = error.message
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .trim();
                assert_1.default.ok(cleanMessage.includes('viole la contrainte de clé étrangère'), `Erreur inattendue : ${cleanMessage}`);
            }
            else {
                assert_1.default.fail("Erreur inattendue, l'objet n'est pas de type Error.");
            }
        }
    });
    it('doit modifier une colonne par son ID', async () => {
        const column = await pool.query('SELECT * FROM columns WHERE name = $1', ['En cours']);
        const columnId = column.rows[0].id;
        await pool.query('UPDATE columns SET name = $1 WHERE id = $2', [
            'En ce moment',
            columnId,
        ]);
        const result = await pool.query('SELECT * FROM columns WHERE id = $1', [
            columnId,
        ]);
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].name, 'En ce moment');
    });
    it('doit insérer une tâche', async () => {
        const column = await pool.query('SELECT * FROM columns WHERE name = $1', ['En ce moment']);
        const columnId = column.rows[0].id;
        await pool.query('INSERT INTO tasks (column_id, name, description) VALUES ($1, $2, $3)', [columnId, 'tâche test', 'Ceci est une tâche test.']);
        const result = await pool.query('SELECT * FROM tasks WHERE name = $1', [
            'tâche test',
        ]);
        assert_1.default.equal(result.rows[0].description, 'Ceci est une tâche test.');
    });
    it("doit modifier le nom d'une tâche par l'ID", async () => {
        const task = await pool.query('SELECT * FROM tasks WHERE name = $1', [
            'tâche test',
        ]);
        const taskId = task.rows[0].id;
        await pool.query('UPDATE tasks SET name = $1 WHERE id = $2', [
            'tâche mis à jour',
            taskId,
        ]);
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [
            taskId,
        ]);
        assert_1.default.equal(result.rows[0].name, 'tâche mis à jour');
    });
    it("doit modifier la description d'une tâche par l'ID", async () => {
        const task = await pool.query('SELECT * FROM tasks WHERE name = $1', [
            'tâche mis à jour',
        ]);
        const taskId = task.rows[0].id;
        await pool.query('UPDATE tasks SET description = $1 WHERE id = $2', [
            'La description est mis à jour.',
            taskId,
        ]);
        const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [
            taskId,
        ]);
        assert_1.default.equal(result.rows[0].description, 'La description est mis à jour.');
    });
    /* Partie suppression */
    it('doit supprimer une tâche par son ID', async () => {
        const task = await pool.query('SELECT * FROM tasks WHERE name = $1', [
            'tâche mis à jour',
        ]);
        const taskId = task.rows[0].id;
        await pool.query('DELETE FROM columns WHERE id = $1', [taskId]);
        const result = await pool.query('SELECT * FROM columns WHERE id = $1', [
            taskId,
        ]);
        assert_1.default.equal(result.rowCount, 0);
    });
    it('doit supprimer une colonne par son ID', async () => {
        const column = await pool.query('SELECT * FROM columns WHERE name = $1', ['En ce moment']);
        const columnId = column.rows[0].id;
        await pool.query('DELETE FROM columns WHERE id = $1', [columnId]);
        const result = await pool.query('SELECT * FROM columns WHERE id = $1', [
            columnId,
        ]);
        assert_1.default.equal(result.rowCount, 0);
    });
    it('doit supprimer un board par son ID', async () => {
        const board = await pool.query('SELECT * FROM boards WHERE name = $1', [
            'Projet mis à jour',
        ]);
        const boardId = board.rows[0].id;
        await pool.query('DELETE FROM boards WHERE id = $1', [boardId]);
        const result = await pool.query('SELECT * FROM boards WHERE id = $1', [
            boardId,
        ]);
        assert_1.default.equal(result.rowCount, 0);
    });
    it('doit supprimer un utilisateur', async () => {
        const result = await pool.query('DELETE FROM users WHERE name = $1 RETURNING *', ['tester1']);
        // Si la suppression a réussi, rowCount renverra le nombre de ligne supprimé
        // Ici, on supprime 1 utilisateur, soit 1 ligne
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].name, 'tester1');
        const checkUser = await pool.query('SELECT * FROM users WHERE name = $1', ['tester']);
        // Si aucune ligne n'est retourné, rowCount renverra 0
        assert_1.default.equal(checkUser.rowCount, 0);
    });
    it('doit supprimer un second utilisateur', async () => {
        const result = await pool.query('DELETE FROM users WHERE name = $1 RETURNING *', ['tester2']);
        // Si la suppression a réussi, rowCount renverra le nombre de ligne supprimé
        // Ici, on supprime 1 utilisateur, soit 1 ligne
        assert_1.default.equal(result.rowCount, 1);
        assert_1.default.equal(result.rows[0].name, 'tester2');
        const checkUser = await pool.query('SELECT * FROM users WHERE name = $1', ['tester']);
        // Si aucune ligne n'est retourné, rowCount renverra 0
        assert_1.default.equal(checkUser.rowCount, 0);
    });
    it("ne doit pas supprimer un utilisateur qui n'existe pas", async () => {
        const result = await pool.query('DELETE FROM users WHERE name = $1 RETURNING *', ['inexistant']);
        assert_1.default.equal(result.rowCount, 0);
    });
    after(async () => {
        await pool.end();
    });
});
