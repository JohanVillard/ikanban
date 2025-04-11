import BoardController from '../controllers/boardController';
import express from 'express';

const router = express.Router();
const boardController = new BoardController();

/**
 * @swagger
 * /board:
 *   post:
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
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du tableau
 *                 example: 'Mon Projet'
 *               userId:
 *                 type: string
 *                 description: L'ID du propriétaire du tableau.
 *                 example: '9bcc60b3-f17d-4f7d-8d42-afe715fb3f0d'
 *     responses:
 *       201:
 *         description: Tableau créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant du tableau
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 name:
 *                   type: string
 *                   description: Le nom du tableau
 *                   example: 'Mon projet'
 *       400:
 *         description: Erreur de validation (Champ manquant)
 *       500:
 *         description: Erreur serveur lors de la création de l'utilisateur
 */
router.post('/board', boardController.createBoard);

/**
 * @swagger
 * /board/list:
 *   get:
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
 *              properties:
 *                id:
 *                  type: string
 *                  description: L'identifiant du tableau.
 *                  example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                name:
 *                  type: string
 *                  description: Le nom du tableau.
 *                  example: 'Mon projet'
 *       404:
 *         description: La liste des tableaux n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tableaux.
 */
router.get('/board/list', boardController.fetchAllBoards);

/**
 * @swagger
 * /board/{id}:
 *   get:
 *     summary: Recupère un tableau par son ID
 *     description: Récupère le tableau correspondant à son ID. 
 *     parameters:
 *       - in: path
 *         name: id
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
 *                   description: L'identifiant de l'utilisateur
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 name:
 *                   type: string
 *                   description: Le nom de l'utilisateur
 *                   example: 'Jean Dupond'
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la récupération du tableau.
 */
router.get('/board/:id', boardController.fetchBoardById)

/**
 * @swagger
 * /board/user/{id}:
 *   get:
 *     summary: Récupère une liste des tableaux par l'ID d'un utilisateur.
 *     description: Récupère la liste des tableaux appartenant à un utilisateur. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID de l'utilisateur des tableaux à récupérer.
 *         schema:
 *           type: string
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
 *                   name:
 *                     type: string
 *                     description: Le nom du tableau.
 *                     example: 'Mon projet'
 *       404:
 *         description: La liste des tableaux n'a pas été trouvée.
 *       500:
 *         description: Erreur lors de la récupération de la liste des tableaux.
 */
router.get('/board/user/:id', boardController.fetchBoardsByUserId);


/**
 * @swagger
 * /board/{id}:
 *   put:
 *     summary: Met à jour un tableau par son ID
 *     description: Met à jour le tableau à correspondant à son ID. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du tableau à mettre à jour.. 
 *     requestBody:
 *       description: Les informations nécessaires pour mettre à jour un tableau.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             optional:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom du tableau.
 *                 example: 'Mon Projet'
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
 *                 name:
 *                   type: string
 *                   description: Le nom du tableau.
 *                   example: 'Mon Projet'
 *       404:
 *         description: Le tableau n'a pas été trouvé.
 *       500:
 *         description: Erreur lors de la suppression du tableau.
 *         
 */
router.put('/board/:id', boardController.updateBoard);

/**
 * @swagger
 * /board/{id}:
 *   delete:
 *     summary: Supprime un tableau par son ID
 *     description: Supprime le tableau correspondant à son ID. 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: L'ID du tableau à supprimer.
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Le tableau a été supprimé avec succès.
 *       404:
 *         description: Le tableau n'as pas été trouvé.
 *       500:
 *         description: Erreur lors de la suppression du tableau.
 */
router.delete('/board/:id', boardController.deleteBoard);

export default router;
