import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Retrieve a list of users
 *     description: Retrieve the list of all users in the system.
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: 'John Doe'
 */
router.get('/user', userController.testUser);

export default router;
