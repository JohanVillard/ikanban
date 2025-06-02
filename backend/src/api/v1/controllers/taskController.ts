import { Request, Response } from 'express';
import TaskService from '../services/taskService.js';
import { Task } from 'types/task.js';
import { validationResult } from 'express-validator';

/**
 * Contrôleur pour gérer les tâches.
 * Ce contrôleur contient des méthodes pour créer, lire, mettre à jour et supprimer des tâches.
 * Le contrôleur gère les requêtes et les réponses HTTP et intéragit avec la classe 'TaskService'.
 */ class TaskController {
    private taskService: TaskService;

    constructor() {
        this.taskService = new TaskService();
    }

    // Il est nécessaire de lier les méthodes à la classe
    // lorsqu'elles sont utilisées par une bibliothèque externe
    // (comme Express ici) afin de préserver le bon contexte de `this`.
    // Les fonctions fléchées utilise la fonction bind() directement.

    /**
     * Crée une nouvelle tâche.
     *
     * Cette méthode extrait les informations de la tâche (nom, description, ID de colonne) depuis la requête,
     * et appelle le service pour créer la tâche. Elle renvoie la tâche créée avec un statut HTTP 201.
     * Si un conflit est détecté (nom de tâche déjà utilisé), une erreur HTTP 409 est renvoyée.
     *
     * @param {Request} req - La requête HTTP contenant les informations nécessaires pour créer la tâche.
     * @param {Response} res - La réponse HTTP envoyée après la création de la tâche.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON avec la tâche créée.
     */
    createTask = async (req: Request, res: Response): Promise<void> => {
        try {
            // Attrape le retour du middleware de validation
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(422).json({
                    success: false,
                    errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
                });
                return;
            }

            const { colId } = req.params;
            const { name, description } = req.body;

            const task = await this.taskService.createTask(
                name,
                description,
                colId
            );

            res.status(201).json({
                success: true,
                data: task,
            });
        } catch (error: any) {
            console.error(`Erreur en créant la tâche (controleur): ${error}`);

            if (error.message === 'Ce nom de tâche est déjà utilisé') {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    /**
     * Récupère une tâche par son ID.
     *
     * Cette méthode récupère l'ID de la tâche depuis les paramètres de la requête,
     * et appelle le service pour obtenir la tâche correspondante. Si la tâche n'est pas trouvée,
     * une erreur HTTP 409 est renvoyée.
     *
     * @param {Request} req - La requête HTTP contenant l'ID de la tâche à récupérer.
     * @param {Response} res - La réponse HTTP renvoyée avec la tâche récupérée ou une erreur.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON avec la tâche récupérée.
     */
    fetchTaskById = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;

            const task = await this.taskService.getTaskById(taskId);

            res.status(200).json({
                success: true,
                data: task,
            });
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la tâche (controleur): ${error}`
            );

            if (error.message === "La tâche n'a pas été trouvée.") {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    /**
     * Récupère toutes les tâches.
     *
     * Cette méthode appelle le service pour récupérer toutes les tâches enregistrées.
     * Si aucune tâche n'est trouvée, une erreur HTTP 409 est renvoyée.
     *
     * @param {Request} req - La requête HTTP qui ne contient pas d'information spécifique ici.
     * @param {Response} res - La réponse HTTP contenant la liste des tâches ou une erreur.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON avec la liste des tâches.
     */
    fetchAllTasks = async (req: Request, res: Response): Promise<void> => {
        try {
            const tasks = await this.taskService.getAllTasks();

            res.status(200).json(tasks);
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la liste de toutes les tâches (controleur): ${error}`
            );

            if (error.message === "Aucune tâche c'est enregistrée.") {
                res.status(409).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };

    /**
     * Récupère toutes les tâches d'une colonne spécifique.
     *
     * Cette méthode récupère les tâches d'une colonne spécifique en fonction de l'ID de la colonne
     * passé dans les paramètres de la requête. Si aucune tâche n'est trouvée dans cette colonne,
     * une erreur HTTP 409 est renvoyée.
     *
     * @param {Request} req - La requête HTTP contenant l'ID de la colonne pour laquelle récupérer les tâches.
     * @param {Response} res - La réponse HTTP contenant la liste des tâches de la colonne.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON avec la liste des tâches de la colonne.
     */
    fetchTasksByColumnsId = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        try {
            const { colId } = req.params;

            const tasks = await this.taskService.getTasksByColumId(colId);

            res.status(200).json({
                success: true,
                data: tasks,
            });
        } catch (error: any) {
            console.error(
                `Erreur en récupérant la liste de toutes les tâches de la colonne (controleur): ${error}`
            );

            if (
                error.message ===
                "Aucune tâche n'est enregistrée dans cette colonne."
            ) {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    /**
     * Met à jour complètement une tâche existante dans la base de données.
     *
     * Cette méthode récupère les nouvelles données de la tâche depuis le corps de la requête (`req.body`)
     * et identifie la tâche à mettre à jour à l'aide des paramètres d'URL (`taskId`, `colId`).
     * Elle met à jour les champs : nom, description, statut de complétion (`done`) et position.
     *
     * @param {Request} req - L'objet représentant la requête HTTP.
     * Contient les paramètres `taskId` et `colId` dans `req.params`,
     * ainsi que les nouvelles données de la tâche dans `req.body`.
     *
     * @param {Response} res - L'objet représentant la réponse HTTP.
     * Retourne un objet JSON contenant la tâche mise à jour en cas de succès, ou un message d'erreur en cas d'échec.
     *
     * @returns {Promise<void>} - Cette fonction ne retourne rien directement, mais envoie une réponse HTTP.
     *
     * @throws {409 Conflict} Si une tâche avec le même nom existe déjà dans la même colonne.
     * @throws {404 Not Found} Si la tâche à mettre à jour n'existe pas.
     * @throws {500 Internal Server Error} En cas d'erreur serveur inattendue.
     */

    updateFullTask = async (req: Request, res: Response): Promise<void> => {
        try {
            // Attrape le retour du middleware de validation
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                res.status(422).json({
                    success: false,
                    errors: errors.mapped(), // Renvoie un objet au lieu d’un tableau
                });
                return;
            }

            const { name, description, done, position } = req.body;
            const { taskId, colId } = req.params;

            const taskData: Task = {
                id: taskId,
                name: name,
                description: description,
                columnId: colId,
                done: done,
                position: position,
            };

            const task = await this.taskService.updateFullTask(
                taskId,
                taskData
            );

            res.status(201).json({
                success: true,
                task,
            });
        } catch (error: any) {
            console.error(
                `Erreur en modifiant la tâche (controleur): ${error}`
            );

            if (error.message === 'Ce nom de tâche est déjà utilisé') {
                res.status(409).json({ success: false, error: error.message });
            } else if (
                error.message ===
                "Impossible de modifier la tâche : elle n'existe pas"
            ) {
                res.status(404).json({
                    success: false,
                    error: error.message,
                });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    /**
     * Met à jour une tâche existante.
     *
     * Cette méthode met à jour une tâche en fonction de son ID, et modifie son nom et/ou sa description.
     * Si la tâche n'existe pas ou si le nom est déjà pris, une erreur est renvoyée.
     *
     * @param {Request} req - La requête HTTP contenant l'ID de la tâche à mettre à jour et les nouvelles informations.
     * @param {Response} res - La réponse HTTP renvoyée avec la tâche mise à jour ou une erreur.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON avec la tâche mise à jour.
     */
    updatePartialTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const taskData: Partial<Task> = req.body;
            const { taskId } = req.params;

            const task = await this.taskService.updatePartialTask(
                taskId,
                taskData
            );

            res.status(201).json({ success: true, data: task });
        } catch (error: any) {
            console.error(
                `Erreur en modifiant la tâche (controleur): ${error}`
            );

            if (
                error.message ===
                'Impossible de modifier la tâche : le nom est déjà pris'
            ) {
                res.status(409).json({
                    success: false,
                    error: error.message,
                });
            } else if (
                error.message ===
                "Impossible de modifier la tâche : elle n'existe pas"
            ) {
                res.status(404).json({ success: false, error: error.message });
            } else {
                res.status(500).json({
                    success: false,
                    error: 'Erreur serveur.',
                });
            }
        }
    };

    /**
     * Supprime une tâche.
     *
     * Cette méthode supprime une tâche en fonction de son ID passé dans les paramètres de la requête.
     * Si la tâche n'existe pas, une erreur est renvoyée.
     *
     * @param {Request} req - La requête HTTP contenant l'ID de la tâche à supprimer.
     * @param {Response} res - La réponse HTTP renvoyée après la suppression de la tâche.
     *
     * @returns {Promise<void>} - Ne retourne rien, mais envoie une réponse JSON indiquant que la tâche a été supprimée.
     */
    deleteTask = async (req: Request, res: Response): Promise<void> => {
        try {
            const { taskId } = req.params;

            const isDeleted = await this.taskService.deleteTask(taskId);

            res.status(200).json({
                isDeleted: isDeleted,
                message: 'La tâche a été supprimé avec succès.',
            });
        } catch (error: any) {
            console.error(
                `Erreur en supprimant la tâche (controleur): ${error}`
            );

            if (
                error.message ===
                "Impossible de supprimer la tâche : elle n'existe pas"
            ) {
                res.status(404).json({ error: error.message });
            } else {
                res.status(500).json({ error: 'Erreur serveur.' });
            }
        }
    };
}

export default TaskController;
