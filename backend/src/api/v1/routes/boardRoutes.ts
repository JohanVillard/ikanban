import express from 'express';
import BoardController from '../controllers/boardController';
import authMiddleware from '../../../middlewares/authMiddleware';
import authorizationMiddleware from '../../../middlewares/authorizationMiddleware';

const router = express.Router();
const boardController = new BoardController();

/**
 * @swagger
 * /board:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags: [Board]
 *     summary: Créer un tableau
 *     description: Crée un nouveau tableau avec les informations fournies.
 *     requestBody:
 *       description: Les informations nécéssaires pour créer un tableau.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du tableau.
 *                 example: 'Mon Projet'
 *     responses:
 *       201:
 *         description: Tableau créé avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant du tableau.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 userId:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur propriétaire.
 *                   example: '16cd3af1-6af6-470e-b244-89200f90e790'
 *                 name:
 *                   type: string
 *                   description: Le nom du tableau.
 *                   example: 'Mon projet'
 *       400:
 *         description: Erreur de validation (Champ manquant)
 *       500:
 *         description: Erreur serveur lors de la création de l'utilisateur
 */
router.post('/board', authMiddleware, boardController.createBoard);

/**
 * @swagger
 * /board/list:
 *   get:
 *     tags: [Board]
 *     summary: Récupère la liste des tableaux
 *     description: Récupère la liste des tableaux.
 *     responses:
 *       200:
 *         description: La liste des tableaux.
 *         content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  id:
 *                    type: string
 *                    description: L'identifiant du tableau.
 *                    example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                  userId:
 *                    type: string
 *                    description: L'identifiant de l'utilisateur propriétaire.
 *                    example: '16cd3af1-6af6-470e-b244-89200f90e790'
 *                  name:
 *                    type: string
 *                    description: Le nom du tableau.
 *                    example: 'Mon projet'
 *       404:
 *         description: La liste des tableaux n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tableaux.
 */
router.get('/board/list', boardController.fetchAllBoards);

/**
 * @swagger
 * /board/{boardId}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Board]
 *     summary: Recupère un tableau par son ID
 *     description: Récupère le tableau correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau à récupérer.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un tableau trouvé par son ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant du tableau.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 name:
 *                   type: string
 *                   description: Le nom du tableau.
 *                   example: 'Mon Projet'
 *                 userId:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur propriétaire.
 *                   example: '16cd3af1-6af6-470e-b244-89200f90e790'
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la récupération du tableau.
 */
router.get(
    '/board/:boardId',
    authMiddleware,
    authorizationMiddleware,
    boardController.fetchBoardById
);

/**
 * @swagger
 * /board:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags: [Board]
 *     summary: Récupère une liste des tableaux par l'ID d'un utilisateur.
 *     description: Récupère la liste des tableaux appartenant à un utilisateur.
 *     responses:
 *       200:
 *         description: Une liste de tableaux appartenant à un utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'identifiant du tableau.
 *                     example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                   userId:
 *                     type: string
 *                     description: L'identifiant de l'utilisateur propriétaire.
 *                     example: '16cd3af1-6af6-470e-b244-89200f90e790'
 *                   name:
 *                     type: string
 *                     description: Le nom du tableau.
 *                     example: 'Mon projet'
 *       404:
 *         description: La liste des tableaux n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tableaux.
 */
router.get('/board', authMiddleware, boardController.fetchBoardsByUserId);

/**
 * @swagger
 * /board/{boardId}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags: [Board]
 *     summary: Met à jour un tableau par son ID
 *     description: Met à jour le tableau à correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau à mettre à jour.
 *     requestBody:
 *       description: Les informations nécessaires pour mettre à jour un tableau.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du tableau.
 *                 example: 'Mon Projet'
 *             required: []  # Indiquer qu'aucun champ n'est strictement requis
 *     responses:
 *       200:
 *         description: Le tableau a été mis à jour avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant du tableau.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 userId:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur propriétaire.
 *                   example: '16cd3af1-6af6-470e-b244-89200f90e'
 *                 name:
 *                   type: string
 *                   description: Le nom du tableau.
 *                   example: 'Mon Projet'
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la modification du tableau.
 *
 */
router.put(
    '/board/:boardId',
    authMiddleware,
    authorizationMiddleware,
    boardController.updateBoard
);

/**
 * @swagger
 * /board/{boardId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags: [Board]
 *     summary: Supprime un tableau par son ID
 *     description: Supprime le tableau correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         description: L'ID du tableau à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Le tableau a été supprimé avec succès.
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la suppression du tableau.
 */
router.delete(
    '/board/:boardId',
    authMiddleware,
    authorizationMiddleware,
    boardController.deleteBoard
);

export default router;
