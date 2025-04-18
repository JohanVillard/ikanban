import assert from 'assert';
import pkg from 'pg';
import { v4 as uuidv4 } from 'uuid';
import config from '../src/config/config.js';
import { createTestDB, createTables } from './setupDB.js';

const { Pool } = pkg;
export const pool = new Pool({
    user: config.db.user,
    host: config.db.host,
    database: config.db.database,
    password: config.db.password,
    port: config.db.port,
});

before(async () => {
    await createTestDB(config.db.database, config.db.user);
    await createTables(config.db.user, config.db.database);
});

describe('Tests de base de données', () => {
    it('doit insérer un utilisateur', async () => {
        const result = await pool.query(
            'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                '75a745c9-975f-4826-a263-13d1dbb2eec5',
                'tester1',
                'tester1@example.com',
                'hashed_password',
            ]
        );
        assert.equal(result.rows[0].name, 'tester1');
        assert.equal(result.rows[0].email, 'tester1@example.com');
        assert.equal(result.rows[0].password_hash, 'hashed_password');
    });

    it('doit insérer un second utilisateur', async () => {
        const result = await pool.query(
            'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
            [
                '2691cd19-1633-46cc-a7b6-15f98e457e71',
                'tester2',
                'tester2@example.com',
                'hashed_password',
            ]
        );
        assert.equal(result.rows[0].name, 'tester2');
        assert.equal(result.rows[0].email, 'tester2@example.com');
        assert.equal(result.rows[0].password_hash, 'hashed_password');
    });

    it('ne doit pas insérer un utilisateur avec le même mail', async () => {
        try {
            await pool.query(
                'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING *',
                [
                    '780afe11-6d37-4cd3-9d96-b444af4ff06e',
                    'tester3',
                    'tester1@example.com',
                    'hashed_password',
                ]
            );

            // Si aucune erreur n'est levée, on échoue explicitement le test
            // L'unicité du champ mail n'est pas respecté
            assert.fail("L'erreur attendue n'a pas été détectée");
        } catch (error) {
            if (error instanceof Error) {
                // Passe le test si le message d'erreur de violation d'unicité retourné par PostgreSQL
                // correspond exactement à ce que l'on attend dans ce cas
                assert.ok(
                    error.message.includes(
                        "la valeur d'une clé dupliquée rompt la contrainte unique"
                    ),
                    `Erreur inattendue : ${error.message}`
                );
            } else {
                // Force le test à échouer dans ce cas, peu de chance...
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it('doit trouver un utilisateur par email', async () => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            ['tester1@example.com']
        );
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].name, 'tester1');
        assert.equal(result.rows[0].email, 'tester1@example.com');
    });

    it('ne doit pas trouver un utilisateur par email inexistant', async () => {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            ['inexistant@example.com']
        );
        assert.equal(result.rowCount, 0);
    });

    it("doit mettre à jour le mail d'un utilisateur existant", async () => {
        const result = await pool.query(
            'UPDATE users SET email = $1 WHERE name = $2 RETURNING *',
            ['updated-email@example.com', 'tester1']
        );
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].email, 'updated-email@example.com');
    });

    it("ne doit pas mettre à jour l'email avec un email déjà enregistré pour un autre utilisateur.", async () => {
        try {
            await pool.query(
                'UPDATE users SET email = $1 WHERE name = $2 RETURNING *',
                ['updated-email@example.com', 'tester2']
            );
            assert.fail("L'erreur attendue n'a pas été détectée");
        } catch (error) {
            if (error instanceof Error) {
                assert.ok(
                    error.message.includes(
                        "la valeur d'une clé dupliquée rompt la contrainte unique"
                    ),
                    `Erreur inattendue : ${error.message}`
                );
            } else {
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it("empêcher l'injection de code SQL", async () => {
        const maliciousEmail = "' OR 1=1 --";

        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [maliciousEmail]
        );
        assert.equal(result.rowCount, 0);
    });

    it('ne doit pas autoriser la valeur NULL dans le champ du nom', async () => {
        try {
            await pool.query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
                [null, 'null@example.com', 'hashed_password']
            );
            assert.fail('Expected error but got none');
        } catch (error) {
            if (error instanceof Error) {
                assert.ok(
                    error.message.includes(
                        'une valeur NULL viole la contrainte NOT NULL'
                    ),
                    `Erreur inattendue : ${error.message}`
                );
            } else {
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it('ne doit pas autoriser la valeur NULL dans le champ du mail', async () => {
        try {
            await pool.query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
                ['null', null, 'hashed_password']
            );
            assert.fail('Expected error but got none');
        } catch (error) {
            if (error instanceof Error) {
                assert.ok(
                    error.message.includes(
                        'une valeur NULL viole la contrainte NOT NULL'
                    ),
                    `Erreur inattendue : ${error.message}`
                );
            } else {
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it('ne doit pas autoriser la valeur NULL dans le champ du mot de passe', async () => {
        try {
            await pool.query(
                'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)',
                ['null', 'null@example.com', null]
            );
            assert.fail('Expected error but got none');
        } catch (error) {
            if (error instanceof Error) {
                assert.ok(
                    error.message.includes(
                        'une valeur NULL viole la contrainte NOT NULL'
                    ),
                    `Erreur inattendue : ${error.message}`
                );
            } else {
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it('doit insérer un board et le récupérer par son ID', async () => {
        const user = await pool.query('SELECT * FROM users WHERE name = $1', [
            'tester1',
        ]);
        const userId = user.rows[0].id;
        const resultInsert = await pool.query(
            'INSERT INTO boards (id, user_id, name) VALUES ($1, $2, $3) RETURNING *',
            ['25677a65-73c9-4a6c-bc70-482f37200725', userId, 'Projet Test']
        );

        const boardId = resultInsert.rows[0].id;

        const resultSelect = await pool.query(
            'SELECT * FROM boards WHERE id = $1',
            [boardId]
        );

        assert.equal(resultSelect.rows[0].name, 'Projet Test');
        assert.equal(resultSelect.rows[0].user_id, userId);
    });

    it("doit mettre à jour le nom d'un board", async () => {
        const board = await pool.query('SELECT * FROM boards WHERE name = $1', [
            'Projet Test',
        ]);

        const boardId = board.rows[0].id;

        const result = await pool.query(
            'UPDATE boards SET name = $1 WHERE id = $2',
            ['Projet mis à jour', boardId]
        );

        const updatedBoard = await pool.query(
            'SELECT * FROM boards WHERE id = $1',
            [boardId]
        );

        assert.equal(result.rowCount, 1);
        assert.equal(updatedBoard.rows[0].name, 'Projet mis à jour');
    });

    it('doit insérer une colonne', async () => {
        const board = await pool.query('SELECT * FROM boards WHERE name = $1', [
            'Projet mis à jour',
        ]);

        const boardId = board.rows[0].id;

        await pool.query(
            'INSERT INTO columns (id, board_id, name) VALUES ($1, $2, $3)',
            ['526e2c21-844e-4c11-ac5b-473303e88306', boardId, 'En cours']
        );

        const result = await pool.query(
            'SELECT * FROM columns WHERE board_id = $1 AND name = $2',
            [boardId, 'En cours']
        );

        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].name, 'En cours');
    });

    it('ne doit pas insérer une colonne sans board_id valide', async () => {
        try {
            const invalidUUID = uuidv4();
            await pool.query(
                'INSERT INTO columns (id, board_id, name) VALUES ($1, $2, $3)',
                [
                    'de87cd7c-dc89-4f21-8ac4-2e2d2ac49612',
                    invalidUUID,
                    'En attente',
                ]
            );

            assert.fail(
                "L'insertion devrait échouer avec un board_id invalide."
            );
        } catch (error) {
            if (error instanceof Error) {
                // On normalise le message d'erreur sinon la comparaison ne fonctionne pas
                const cleanMessage = error.message
                    .toLowerCase()
                    .replace(/\s+/g, ' ')
                    .trim();

                assert.ok(
                    cleanMessage.includes(
                        'viole la contrainte de clé étrangère'
                    ),
                    `Erreur inattendue : ${cleanMessage}`
                );
            } else {
                assert.fail(
                    "Erreur inattendue, l'objet n'est pas de type Error."
                );
            }
        }
    });

    it('doit modifier une colonne par son ID', async () => {
        const column = await pool.query(
            'SELECT * FROM columns WHERE name = $1',
            ['En cours']
        );

        const columnId = column.rows[0].id;

        await pool.query('UPDATE columns SET name = $1 WHERE id = $2', [
            'En ce moment',
            columnId,
        ]);

        const result = await pool.query('SELECT * FROM columns WHERE id = $1', [
            columnId,
        ]);

        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].name, 'En ce moment');
    });

    it('doit insérer une tâche', async () => {
        const column = await pool.query(
            'SELECT * FROM columns WHERE name = $1',
            ['En ce moment']
        );

        const columnId = column.rows[0].id;

        await pool.query(
            'INSERT INTO tasks (id, column_id, name, description) VALUES ($1, $2, $3, $4)',
            [
                'd149a698-ad09-4518-a671-336526e97918',
                columnId,
                'tâche test',
                'Ceci est une tâche test.',
            ]
        );

        const result = await pool.query('SELECT * FROM tasks WHERE name = $1', [
            'tâche test',
        ]);
        assert.equal(result.rows[0].description, 'Ceci est une tâche test.');
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
        assert.equal(result.rows[0].name, 'tâche mis à jour');
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
        assert.equal(
            result.rows[0].description,
            'La description est mis à jour.'
        );
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
        assert.equal(result.rowCount, 0);
    });

    it('doit supprimer une colonne par son ID', async () => {
        const column = await pool.query(
            'SELECT * FROM columns WHERE name = $1',
            ['En ce moment']
        );

        const columnId = column.rows[0].id;

        await pool.query('DELETE FROM columns WHERE id = $1', [columnId]);

        const result = await pool.query('SELECT * FROM columns WHERE id = $1', [
            columnId,
        ]);
        assert.equal(result.rowCount, 0);
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
        assert.equal(result.rowCount, 0);
    });

    it('doit supprimer un utilisateur', async () => {
        const result = await pool.query(
            'DELETE FROM users WHERE name = $1 RETURNING *',
            ['tester1']
        );
        // Si la suppression a réussi, rowCount renverra le nombre de ligne supprimé
        // Ici, on supprime 1 utilisateur, soit 1 ligne
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].name, 'tester1');

        const checkUser = await pool.query(
            'SELECT * FROM users WHERE name = $1',
            ['tester']
        );
        // Si aucune ligne n'est retourné, rowCount renverra 0
        assert.equal(checkUser.rowCount, 0);
    });

    it('doit supprimer un second utilisateur', async () => {
        const result = await pool.query(
            'DELETE FROM users WHERE name = $1 RETURNING *',
            ['tester2']
        );
        // Si la suppression a réussi, rowCount renverra le nombre de ligne supprimé
        // Ici, on supprime 1 utilisateur, soit 1 ligne
        assert.equal(result.rowCount, 1);
        assert.equal(result.rows[0].name, 'tester2');

        const checkUser = await pool.query(
            'SELECT * FROM users WHERE name = $1',
            ['tester']
        );
        // Si aucune ligne n'est retourné, rowCount renverra 0
        assert.equal(checkUser.rowCount, 0);
    });

    it("ne doit pas supprimer un utilisateur qui n'existe pas", async () => {
        const result = await pool.query(
            'DELETE FROM users WHERE name = $1 RETURNING *',
            ['inexistant']
        );
        assert.equal(result.rowCount, 0);
    });
});
