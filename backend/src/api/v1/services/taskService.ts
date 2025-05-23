import { Task } from '../../../types/task';
import TaskDb from '../repositories/taskDb';
import { v4 as uuidv4 } from 'uuid';

/**
 * Service pour la gestion des tâches.
 * Ce service contient des méthodes pour créer, lire, mettre à jour et supprimer des tâches.
 * Il interagit avec la base de données via la classe `TaskDb`.
 */ class TaskService {
    private taskDb: TaskDb;

    constructor() {
        this.taskDb = new TaskDb();
    }

    /**
     * Crée une nouvelle tâche.
     * Vérifie si une tâche avec le même nom existe déjà dans la colonne spécifiée.
     * Si une tâche existe déjà, une erreur est lancée.
     * Si la création échoue, une erreur est également lancée.
     *
     * @param {string} name - Le nom de la tâche à créer.
     * @param {string} description - La description de la tâche à créer.
     * @param {string} columnId - L'ID de la colonne à laquelle la tâche sera ajoutée.
     * @returns {Promise<Task>} La tâche créée.
     * @throws {Error} Si une tâche avec le même nom existe déjà ou si la création échoue.
     */
    async createTask(
        name: string,
        description: string,
        columnId: string
    ): Promise<Task> {
        try {
            const taskExists =
                await this.taskDb.findByNameAndColumnIdAndBoardId(
                    name,
                    columnId
                );
            if (taskExists) {
                throw new Error('Ce nom de tâche est déjà utilisé.');
            }

            const id = uuidv4();
            const task = await this.taskDb.create(
                id,
                columnId,
                name,
                description
            );
            if (!task) {
                throw new Error('La creation de la tâche a échouée.');
            }

            return {
                id: task.id,
                name: task.name,
                description: task.description,
                columnId: task.column_id,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la création de la tâche (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Récupère une tâche par son ID.
     * Si la tâche n'est pas trouvée, une erreur est lancée.
     *
     * @param {string} id - L'ID de la tâche à récupérer.
     * @returns {Promise<Task>} La tâche récupérée.
     * @throws {Error} Si la tâche n'est pas trouvée.
     */
    async getTaskById(id: string): Promise<Task> {
        try {
            const task = await this.taskDb.findById(id);
            if (!task) {
                throw new Error("La tâche n'a pas été trouvée.");
            }

            return {
                id: task.id,
                name: task.name,
                description: task.description,
                columnId: task.column_id,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la tâche (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Récupère toutes les tâches.
     * Si aucune tâche n'est enregistrée, une erreur est lancée.
     *
     * @returns {Promise<Task[]>} La liste de toutes les tâches.
     * @throws {Error} Si aucune tâche n'est enregistrée.
     */
    async getAllTasks(): Promise<Task[]> {
        try {
            const dbTasks = await this.taskDb.findAll();
            if (!dbTasks) {
                throw new Error("Aucune tâche c'est enregistrée.");
            }

            const tasks = dbTasks.map((task) => ({
                ...task,
                columnId: task.column_id,
            }));

            return tasks;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la liste de toutes les tâches (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Récupère toutes les tâches d'une colonne spécifique.
     * Si aucune tâche n'est enregistrée dans la colonne, une erreur est lancée.
     *
     * @param {string} columnId - L'ID de la colonne dont on veut récupérer les tâches.
     * @returns {Promise<Task[]>} La liste des tâches de la colonne.
     * @throws {Error} Si aucune tâche n'est enregistrée dans cette colonne.
     */
    async getTasksByColumId(columnId: string): Promise<Task[]> {
        try {
            const dbTasks = await this.taskDb.findByColumnId(columnId);
            if (!dbTasks) {
                throw new Error(
                    "Aucune tâche n'est enregistrée dans cette colonne."
                );
            }

            const tasks = dbTasks.map((task) => ({
                ...task,
                columnId: task.column_id,
            }));

            return tasks;
        } catch (error) {
            console.error(
                `Erreur lors de la récupération de la liste de toutes les tâches par colonne (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Met à jour une tâche en fonction de son ID.
     * Si la tâche à mettre à jour n'existe pas, une erreur est lancée.
     * En cas de succès, la tâche mise à jour est retournée.
     *
     * @param {string} name - Le nouveau nom de la tâche.
     * @param {string} description - La nouvelle description de la tâche.
     * @param {string} id - L'ID de la tâche à mettre à jour.
     * @returns {Promise<Task>} La tâche mise à jour.
     * @throws {Error} Si la tâche n'existe pas ou si la mise à jour échoue.
     */
    async updateTask(
        name: string,
        description: string,
        id: string
    ): Promise<Task> {
        try {
            const taskToUpdate = await this.taskDb.findById(id);
            if (!taskToUpdate) {
                throw new Error(
                    "Impossible de modifier la tâche : elle n'existe pas"
                );
            }

            const updatedtask = await this.taskDb.update(name, description, id);

            return {
                id: updatedtask.id,
                name: updatedtask.name,
                description: updatedtask.description,
                columnId: updatedtask.column_id,
            };
        } catch (error) {
            console.error(
                `Erreur lors de la mise à jour de la tâche (Service): ${error}`
            );
            throw error;
        }
    }

    /**
     * Supprime une tâche par son ID.
     * Si la tâche à supprimer n'existe pas, une erreur est lancée.
     * Si la suppression réussit, un booléen est retourné.
     *
     * @param {string} id - L'ID de la tâche à supprimer.
     * @returns {Promise<boolean>} Un booléen indiquant si la suppression a réussi.
     * @throws {Error} Si la tâche n'existe pas ou si la suppression échoue.
     */
    async deleteTask(id: string): Promise<boolean> {
        try {
            const isDeleted = await this.taskDb.delete(id);
            if (!isDeleted) {
                throw new Error(
                    "Impossible de supprimer la tâche : elle n'existe pas"
                );
            }

            return isDeleted;
        } catch (error) {
            console.error(
                `Erreur lors de la suppression de la tâche (Service): ${error}`
            );
            throw error;
        }
    }
}

export default TaskService;
