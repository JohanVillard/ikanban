import express from 'express';
import TaskController from '../controllers/taskController';
import authMiddleware from '../../../middlewares/authMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';

const router = express.Router();
const taskController = new TaskController();

/**
 * @swagger
 * /board/{boardId}/column/{colId}/task:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Task]
 *     summary: Créer une tâche
 *     description: Crée une nouvelle tâche avec les informations fournies.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la tâche.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne propriétaire du tableau.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Les informations nécéssaires pour créer une tâche.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de la tâche.
 *                 example: 'Couper les pommes'
 *               description:
 *                 type: string
 *                 description: La description de la tâche.
 *                 example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *     responses:
 *       201:
 *         description: Tâche créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la tâche.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 columnId:
 *                    type: string
 *                    description: L'identifiant de la colonne.
 *                    example: '784c84ae-6d94-4262-9e1a-a05039c0be84'
 *                 name:
 *                   type: string
 *                   description: Le nom de la tâche.
 *                   example: 'Couper les pommes'
 *                 description:
 *                   type: string
 *                   description: La description de la tâche.
 *                   example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *       400:
 *         description: Erreur de validation (Champ manquant)
 *       500:
 *         description: Erreur serveur lors de la création de la tâche
 */
router.post(
    '/board/:boardId/column/:colId/task',
    authMiddleware,
    taskController.createTask
);

/**
 * @swagger
 * /task/list:
 *   get:
 *     tags: [Task]
 *     summary: Récupère la liste de toutes les tâches
 *     description: Récupère la liste de toutes les tâches.
 *     responses:
 *       200:
 *         description: La liste de toutes les tâches.
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: L'identifiant de la tâche.
 *                    example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                  columnId:
 *                    type: string
 *                    description: L'identifiant de la colonne.
 *                    example: '784c84ae-6d94-4262-9e1a-a05039c0be84'
 *                  name:
 *                    type: string
 *                    description: Le nom du tableau.
 *                    example: 'Couper les pommes'
 *                  description:
 *                    type: string
 *                    description: La description de la tâche.
 *                    example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *       404:
 *         description: La liste des tâches n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tâches.
 */
router.get('/task/list', taskController.fetchAllTasks);

/**
 * @swagger
 * /board/{boardId}/column/{colId}/task/{taskId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Task]
 *     summary: Recupère une tâche par son ID
 *     description: Récupère la tâche correspondante à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la tâche à récupérer.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne propriétaire du tableau.
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: L'ID de la tâche à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Une tâche trouvée par son ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la tâche.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 columnId:
 *                   type: string
 *                   description: L'identifiant de la colonne.
 *                   example: '784c84ae-6d94-4262-9e1a-a05039c0be84'
 *                 name:
 *                   type: string
 *                   description: Le nom de la tâche.
 *                   example: 'Couper les pommes'
 *                 description:
 *                   type: string
 *                   description: La description de la tâche.
 *                   example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *       404:
 *         description: La tâche n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la tâche.
 */
router.get(
    '/board/:boardId/column/:colId/task/:taskId',
    authMiddleware,
    authorizationMiddleware,
    taskController.fetchTaskById
);

/**
 * @swagger
 * /board/{boardId}/column/{colId}/task:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Task]
 *     summary: Récupère une liste de tâches par l'ID d'une colonne.
 *     description: Récupère la liste des tâches appartenant à une colonne.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la colonne des tâches à récupérer.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne des tâches à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Une liste de tableaux appartenant à une colonne.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'identifiant de la tâche.
 *                     example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                   columnId:
 *                     type: string
 *                     description: L'identifiant de la colonne.
 *                     example: '784c84ae-6d94-4262-9e1a-a05039c0be84'
 *                   name:
 *                     type: string
 *                     description: Le nom de la tâche.
 *                     example: 'Couper les pommes'
 *                   description:
 *                     type: string
 *                     description: La description de la tâche.
 *                     example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *       404:
 *         description: La liste des tâches de la colonne n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tâches de la colonne.
 */
router.get(
    '/board/:boardId/column/:colId/task',
    authMiddleware,
    authorizationMiddleware,
    taskController.fetchTasksByColumnsId
);

/**
 * @swagger
 * /board/{boardId}/column/{colId}/task/{taskId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Task]
 *     summary: Modifie une tâche par son ID
 *     description: Modifie la tâche correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la tâche à modifier.
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne propriétaire du tableau.
 *         schema:
 *           type: string
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: L'ID de la tâche à modifier.
 *     requestBody:
 *       description: Les informations nécessaires pour modifier la tâche.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             optional:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du tâche.
 *                 example: 'Couper les pommes'
 *               description:
 *                 type: string
 *                 description: Le description de la tâche.
 *                 example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *     responses:
 *       200:
 *         description: La tâche a été modifiée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de la tâche.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 columnId:
 *                   type: string
 *                   description: L'identifiant de la colonne propriétaire.
 *                   example: '16cd3af1-6af6-470e-b244-89200f90e'
 *                 name:
 *                   type: string
 *                   description: Le nom de la tâche.
 *                   example: 'Couper les pommes'
 *                 description:
 *                   type: string
 *                   description: La description de la tâche.
 *                   example: "D'abord, il faut peler la pomme puis la couper en quartier"
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la suppression du tableau.
 *
 */
router.put(
    '/board/:boardId/column/:colId/task/:taskId',
    authMiddleware,
    authorizationMiddleware,
    taskController.updateTask
);

/**
 * @swagger
 * /board/{boardId}/column/{colId}/task/{taskId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Task]
 *     summary: Supprime une tâche par son ID
 *     description: Supprime la tâche correspondante à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau propriétaire de la tâche à supprimer.
 *         schema:
 *           type: string
 *       - in: path
 *         name: colId
 *         required: true
 *         description: L'ID de la colonne propriétaire du tableau.
 *       - in: path
 *         name: taskId
 *         required: true
 *         description: L'ID de la tâche à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: La tâche a été supprimé avec succès.
 *       404:
 *         description: La tâche n'as pas été trouvée.
 *       500:
 *         description: Erreur lors de la suppression de la tâche.
 */
router.delete(
    '/board/:boardId/task/:taskId',
    authMiddleware,
    authorizationMiddleware,
    taskController.deleteTask
);

export default router;
