import express from 'express';
import UserController from '../controllers/userController.js';
import authValidationSchema from '../../../middlewares/authValidation.js';
import registerValidationSchema from '../../../middlewares/registerValidation.js';
import authMiddleware from '../../../middlewares/authMiddleware.js';
import loginLimiter from '../../../middlewares/loginLimiter.js';

const router = express.Router();
const userController = new UserController();

/**
 * @swagger
 * /register:
 *   post:
 *     tags: [Auth]
 *     summary: Créer un utilisateur
 *     description: Crée un nouvel utilisateur avec les informations fournies.
 *     requestBody:
 *       description: Les informations nécessaires pour créer un utilisateur.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Le nom de l'utilisateur.
 *                 example: 'Jean Dupond'
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur.
 *                 example: 'jean.dupond@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur.
 *                 example: 'Motdepasse123!'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
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
 *                   description: L'email de l'utilisateur.
 *                   example: 'jean.dupond@example.com'
 *       400:
 *         description: Erreurs de validation (Champs manquants ou invalides)
 *       500:
 *         description: Erreur serveur lors de la création de l'utilisateur
 */
router.post('/register', registerValidationSchema, userController.registerUser);

/**
 * @swagger
 * /login:
 *   post:
 *     tags: [Auth]
 *     summary: Identifier un utilisateur
 *     description: Identifie un utilisateur avec les informations fournies.
 *     requestBody:
 *       description: Les informations nécessaires pour identifier un utilisateur.
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: L'email de l'utilisateur
 *                 example: 'jean.dupond@example.com'
 *               password:
 *                 type: string
 *                 description: Le mot de passe de l'utilisateur
 *                 example: 'Motdepasse123!'
 *     responses:
 *       201:
 *         description: Utilisateur identifié avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Si la connexion a réussi renvoie true, sinon false.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Le message de confirmation de connexion.
 *                   example: 'Vous êtes connecté.'
 *       400:
 *         description: Erreurs de validation (Champs manquants ou invalides)
 *       500:
 *         description: Erreur serveur lors de l'identification de l'utilisateur
 */
router.post(
    '/login',
    authValidationSchema,
    loginLimiter,
    userController.loginUser
);

/**
 * @swagger
 * /logout:
 *   post:
 *     tags: [Auth]
 *     summary: Déconnecter un utilisateur
 *     description: Supprime le cookie d'authentification (token) et déconnecte un utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur déconnecté avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indique si la déconnexion a réussi.
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Le message de confirmation de déconnexion.
 *                   example: 'Déconnexion réussie.'
 *       400:
 *         description: Mauvaise requête, cookie absent ou session déjà expirée.
 *       500:
 *         description: Erreur serveur lors de la déconnexion.
 */
router.post('/logout', authMiddleware, userController.logoutUser);

/**
 * @swagger
 * /me:
 *   get:
 *     tags: [Auth]
 *     summary: Récupère les informations de l'utilisateur connecté
 *     description: Retourne les données du profil utilisateur à partir du token d'authentification présent dans le cookie.
 *     responses:
 *       200:
 *         description: Informations de l'utilisateur récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *       401:
 *         description: Non autorisé – Token manquant ou invalide.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur serveur.
 */

router.get('/me', authMiddleware, userController.userProfile);

export default router;
