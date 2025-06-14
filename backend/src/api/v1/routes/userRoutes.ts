import express from 'express';
import UserController from '../controllers/userController.js';
import authMiddleware from '../../../middlewares/authMiddleware.js';
import updateUserValidationSchema from '../../../middlewares/updateUserValidation.js';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /user/list:
 *   get:
 *     tags: [User]
 *     summary: Recupère la liste des utilisateurs
 *     description: Récupère la liste des utilisateurs.
 *     responses:
 *       200:
 *         description: La liste des utilisateurs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: L'identifiant de l'utilisateur
 *                     example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                   name:
 *                     type: string
 *                     description: Le nom de l'utilisateur
 *                     example: 'Jean Dupond'
 *                   email:
 *                     type: string
 *                     description: Le mail de l'utilisateur
 *                     example: 'jean.dupond@example.com'
 *       404:
 *         description: La liste des utilisateurs n'as pas été trouvée
 *       500:
 *         description: Erreur lors de la récupération de la liste des utilisateurs
 */
router.get('/user/list', userController.fetchAllUsers);

/**
 * @swagger
 * /user/{userId}:
 *   get:
 *     tags: [User]
 *     summary: Recupère un utilisateur par son ID
 *     description: Récupère l'utilisateur correspondant à son ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: L'ID de l'utilisateur à récupérer
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Un utilisateur trouvé par son ID
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
 *                 email:
 *                   type: string
 *                   description: Le mail de l'utilisateur
 *                   example: 'jean.dupond@example.com'
 *       404:
 *         description: L'utilisateur n'as pas été trouvé
 *       500:
 *         description: Erreur lors de la récupération de l'utilisateur
 */
router.get('/user/:userId', authMiddleware, userController.fetchUserById);

/**
 * @swagger
 * /user:
 *   patch:
 *     tags: [User]
 *     summary: Modifie un utilisateur par son ID
 *     description: Modifie l'utilisateur correspondant à son ID.
 *     requestBody:
 *       description: Les informations nécessaires pour modifier un utilisateur.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             optional:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de l'utilisateur.
 *                 example: 'Jean Dupond'
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'jean.dupond@example.com'
 *     responses:
 *       200:
 *         description: L'utilisateur a été modifié avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: L'identifiant de l'utilisateur.
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 name:
 *                   type: string
 *                   description: Le nom de l'utilisateur.
 *                   example: 'Jean Dupond'
 *                 email:
 *                   type: string
 *                   description: Le mail de l'utilisateur.
 *                   example: 'jean.dupond@example.com'
 *       404:
 *         description: L'utilisateur n'as pas été trouvé.
 *       500:
 *         description: Erreur lors de la modification de l'utilisateur.
 */
router.patch(
    '/user',
    authMiddleware,
    updateUserValidationSchema,
    userController.updateUser
);

/**
 * @swagger
 * /user:
 *   delete:
 *     tags: [User]
 *     summary: Supprime un utilisateur connecté
 *     description: Supprime l'utilisateur correspondant à son ID contenu dans un cookie.
 *     responses:
 *       204:
 *         description: L'utilisateur a été supprimé avec succès
 *       404:
 *         description: L'utilisateur n'as pas été trouvé
 *       500:
 *         description: Erreur lors de la suppression de l'utilisateur
 */
router.delete('/user', authMiddleware, userController.deleteUser);

export default router;
