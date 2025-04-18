import express from 'express';
import UserController from '../controllers/userController';
import userValidationSchema from '../../../middlewares/userValidation';

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
 *                 example: 'motdepasse123'
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
router.post('/register', userValidationSchema, userController.registerUser);

/**
 * @swagger
 * /login:
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
 *                 example: 'motdepasse123'
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
 *                   description: L'identifiant de l'utilisateur
 *                   example: '75013455-fe9a-423a-a398-88d8b46d32ad'
 *                 name:
 *                   type: string
 *                   description: Le nom de l'utilisateur
 *                   example: 'Jean Dupond'
 *                 email:
 *                   type: string
 *                   description: L'email de l'utilisateur
 *                   example: 'jean.dupond@example.com'
 *       400:
 *         description: Erreurs de validation (Champs manquants ou invalides)
 *       500:
 *         description: Erreur serveur lors de la création de l'utilisateur
 */
router.post('/login', userController.loginUser);

export default router;
