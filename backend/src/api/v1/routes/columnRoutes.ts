import express from 'express';
import ColumnController from '../controllers/columnController';
import authMiddleware from '../../../middlewares/authMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';
import columnValidationSchema from '../../../middlewares/columnValidation';

const router = express.Router();
const columnController = new ColumnController();

/**
 * @swagger
 * /board/{boardId}/column:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Column]
 *     summary: Créer une colonne
 *     description: Crée une nouvelle colonne avec les informations fournies.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L’ID du tableau auquel ajouter la colonne.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Les informations nécessaires pour créer une colonne.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la colonne.
 *                 example: 'En cours'
 *     responses:
 *       201:
 *         description: Colonne créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la colonne.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 boardId:
 *                   type: string
 *                   description: L'identifiant du tableau propriétaire de la colonne.
 *                   example: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name:
 *                   type: string
 *                   description: Le nom de la colonne.
 *                   example: 'En cours'
 *                 position:
 *                   type: number
 *                   description: La position de la colonne.
 *                   example: 2
 *       400:
 *         description: Erreur de validation (Champ manquant).
 *       500:
 *         description: Erreur serveur lors de la création de la colonne.
 */
router.post(
    '/board/:boardId/column',
    authMiddleware,
    columnValidationSchema,
    columnController.createColumn
);

/**
 * @swagger
 * /column/list:
 *   get:
 *     tags: [Column]
 *     summary: Récupère la liste de toutes les colonnes
 *     description: Récupère la liste de toute les colonnes.
 *     responses:
 *       200:
 *         description: Une liste de colonnes appartenant à un tableau.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'identifiant de la colonne.
 *                     example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                   board_id:
 *                     type: string
 *                     description: L'identifiant du tableau propriétaire de la colonne.
 *                     example: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                   name:
 *                     type: string
 *                     description: Le nom de la colonne.
 *                     example: 'En cours'
 *                   position:
 *                     type: number
 *                     description: La position de la colonne.
 *                     example: 1
 *             example:
 *               - id: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 board_id: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name: 'En cours'
 *                 position: 1
 *               - id: '11223344-5678-9101-abc2-3d4e5f6g7h8i'
 *                 board_id: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name: 'À faire'
 *                 position: 2
 *               - id: '98765432-1a2b-3c4d-5e6f-7890g1h2i3j4'
 *                 board_id: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name: 'Terminé'
 *                 position: 3
 *       404:
 *         description: La liste des colonnes n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des colonnes.
 */
router.get('/column/list', columnController.fetchAllColumns);

/**
 * @swagger
 * /board/{boardId}/column/{colId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Column]
 *     summary: Recupère une colonne par son ID
 *     description: Récupère la colonne correspondante à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la colonne à récupérer.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Une colonne trouvée par son ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la colonne.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 boardId:
 *                   type: string
 *                   description: L'identifiant du tableau propriétaire de la colonne.
 *                   example: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name:
 *                   type: string
 *                   description: Le nom de la colonne.
 *                   example: 'En cours'
 *                 position:
 *                   type: number
 *                   description: La position de la colonne.
 *                   example: 1
 *       404:
 *         description: La colonne n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la colonne.
 */
router.get(
    '/board/:boardId/column/:colId',
    authMiddleware,
    authorizationMiddleware,
    columnController.fetchColumnById
);

/**
 * @swagger
 * /board/{boardId}/column:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Column]
 *     summary: Récupère une liste des colonnes par l'ID d'un tableau.
 *     description: Récupère la liste des colonnes appartenant à un tableau.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L’ID du tableau dont on souhaite obtenir les colonnes.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Une liste de colonnes appartenant à un tableau.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'identifiant de la colonne.
 *                     example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                   boardId:
 *                     type: string
 *                     description: L'identifiant du tableau propriétaire de la colonne.
 *                     example: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                   name:
 *                     type: string
 *                     description: Le nom de la colonne.
 *                     example: 'En cours'
 *                   position:
 *                     type: number
 *                     description: La position de la colonne.
 *                     example: 1
 *                 example:
 *                   - id: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                     boardId: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                     name: 'En cours'
 *                     position: 1
 *                   - id: '11223344-5678-9101-abc2-3d4e5f6g7h8i'
 *                     boardId: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                     name: 'À faire'
 *                     position: 2
 *                   - id: '98765432-1a2b-3c4d-5e6f-7890g1h2i3j4'
 *                     boardId: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                     name: 'Terminé'
 *                     position: 3
 *       404:
 *         description: La liste des colonnes n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des colonnes.
 */
router.get(
    '/board/:boardId/column',
    authMiddleware,
    authorizationMiddleware,
    columnController.fetchColumnsByBoardId
);

/**
 * @swagger
 * /board/{boardId}/column/{colId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Column]
 *     summary: Modifie une colonne par son ID
 *     description: Modifie la colonne correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau contenant la colonne.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'id de la colonne à modifier.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Les informations nécessaires pour modifier une colonne.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la colonne.
 *                 example: 'Terminée'
 *     responses:
 *       200:
 *         description: La colonne a été modifiée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la colonne.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 boardId:
 *                   type: string
 *                   description: L'identifiant du tableau propriétaire de la colonne.
 *                   example: '1417f7d7-11b6-4cea-be1d-2605656b9f81'
 *                 name:
 *                   type: string
 *                   description: Le nom de la colonne.
 *                   example: 'En cours'
 *                 position:
 *                   type: number
 *                   description: La position de la colonne.
 *                   example: 1
 *       404:
 *         description: La colonne n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la modification de la colonne.
 *
 */
router.put(
    '/board/:boardId/column/:colId',
    authMiddleware,
    authorizationMiddleware,
    columnValidationSchema,
    columnController.updateColumn
);

/**
 * @swagger
 * /board/{boardId}/column/{colId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Column]
 *     summary: Supprime une colonne par son ID
 *     description: Supprime la colonne correspondante à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau contenant la colonne.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: La colonne a été supprimée avec succès.
 *       404:
 *         description: La colonne n'as pas été trouvée.
 *       500:
 *         description: Erreur lors de la suppression de la colonne.
 */
router.delete(
    '/board/:boardId/column/:colId',
    authMiddleware,
    authorizationMiddleware,
    columnController.deleteColumn
);

export default router;
