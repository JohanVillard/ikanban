import {
    updateColumnIdTask,
    updateTaskPosition,
} from '../../services/taskServices';
import { UpdateTaskResponse } from '../../types/api';
import Toast from '../toast/Toast';
import updateWipDisplay from './updateWipDisplay';

export function HandleDragOver(e: DragEvent) {
    e.preventDefault();
}

/**
 * Gestionnaire d'événement déclenché au début du glisser-déposer d'une tâche.
 * Récupère les identifiants de la tâche et de sa colonne via les attributs data-*,
 * puis les stocke dans l'objet dataTransfer pour les utiliser lors du drop.
 *
 * @param {DragEvent} e - L'événement de dragstart
 */
export function HandleDragStart(e: DragEvent) {
    // 1. Récupération de l'élément cible du drag (la tâche)
    const taskElement = e.target as HTMLElement;

    // 2. Extraction des données personnalisées data-task-id et data-task-column-id
    const taskId = taskElement.dataset.taskId;
    const columnId = taskElement.dataset.taskColumnId;

    if (taskId && columnId) {
        // 3. Stockage des données dans l'objet dataTransfer pour le transfert lors du drop
        e.dataTransfer?.setData('taskId', taskId);
        e.dataTransfer?.setData('taskColumnId', columnId);

        // 3. Ajout d'une classe CSS pour appliquer un style spécifique durant le drag
        taskElement.classList.add('dragging');
    }
}

export function HandleDragEnd(e: DragEvent) {
    // Je récupère la tâche ciblée
    // Je convertis l'évenement en item de liste
    const taskElement = e.target as HTMLLIElement;

    // Je nettoie les classes CSS
    if (taskElement) {
        taskElement.classList.remove('dragging');
    }
}

export function HandleDragDrop(boardId: string, columnId: string) {
    return async function (e: DragEvent) {
        e.preventDefault();

        const taskId = e.dataTransfer?.getData('taskId');
        const taskColumnId = e.dataTransfer?.getData('taskColumnId');

        // columnId : id de la colonne où dépose la tâche
        // tasksColumId : ancienne id de la colonne propriétaire de la tâche

        if (!taskId) {
            console.error(`L'identifiant de la tâche n'a pas été trouvé.`);
            return;
        }

        if (!taskColumnId) {
            console.error(
                `L'identifiant de la colonne de la tâche n'a pas été trouvé.`
            );
            return;
        }

        const draggedTask = document.querySelector(
            `[data-task-id="${taskId}"]`
        );
        if (!draggedTask) {
            console.error("La tâche saisie n'a pas été retrouvée");
            return;
        }

        const tasksList = e.currentTarget as HTMLElement;

        // Je mets à jour l'ID de la colonne propriétaire de la tâche dans la BDD
        try {
            if (columnId !== taskColumnId) {
                const addTaskToColumn = await updateColumnIdTask(
                    boardId,
                    taskColumnId,
                    taskId,
                    columnId
                );

                if (!addTaskToColumn.success) {
                    Toast(addTaskToColumn.error, 'failure');
                    return;
                }
            }

            moveTaskInDom(tasksList, draggedTask, e);

            // Mise à jour de la colonne propriétaire de la tâche dans le DOM
            draggedTask.setAttribute('data-task-column-id', columnId);

            updateWipDisplay(taskColumnId); // Mise à jour de la colonne de départ
            updateWipDisplay(columnId); // Mise à jour de la colonne d'arrivée

            // Je récupère la liste des tâches mise à jour dans le DOM
            // Convertis une NodeList en tableau
            const orderedTasks = [...tasksList.querySelectorAll('li')];

            // Mise à jour des positions récupérées à partir du dom dans la bdd
            await updateTaskPositions(boardId, columnId, orderedTasks);
        } catch (error) {
            console.error(`erreur lors de la mise à jour de la tâche ${error}`);
        }
    };
}

async function moveTaskInDom(
    tasksList: HTMLElement,
    draggedTask: Element,
    e: DragEvent
): Promise<void> {
    // Je récupère toute les tâches dans le DOM sous forme de tableau
    // Sauf celle que j'ai grab
    const allTasks = [...tasksList.querySelectorAll('li')].filter(
        (element) => element !== draggedTask
    );

    if (allTasks.length === 0) {
        // Je déplace la tâche si le tableau est vide
        // La position est forcement 0
        tasksList.appendChild(draggedTask);
    }

    // Je trouve la tâche devant laquelle on va insérer en lachant le clic de la souris
    // Si la position verticale de la souris est au-dessus du milieu de la tâche actuelle,
    // Alors la tâche grabbée sera insérée avant cette tâche.
    let insertBefore = null;
    for (const task of allTasks) {
        // Je récupère la position de la tâche à l'écran
        const rect = task.getBoundingClientRect();

        // Je compare la position de l'axe vertical de la souris
        // et le milieu vertical de la tâche
        // Si la souris est au-dessus de ce milieu, on insère avant la tâche
        if (e.clientY < rect.top + rect.height / 2) {
            insertBefore = task;
            break;
        }
    }

    // Insère soit avant, soit à la dernière position
    if (insertBefore) {
        tasksList.insertBefore(draggedTask, insertBefore);
    } else {
        tasksList.appendChild(draggedTask);
    }
}

/**
 * Met à jour les positions des tâches dans une colonne donnée,
 * en fonction de leur ordre actuel dans le DOM.
 *
 * @param {string} boardId - L'identifiant du tableau contenant les colonnes.
 * @param {string} columnId - L'identifiant de la colonne où les tâches sont ordonnées.
 * @param {HTMLElement[]} tasks - Un tableau d'éléments représentant les tâches ordonnées dans le DOM.
 * @returns {Promise<UpdateTaskResponse[]>} Une promesse résolue avec les réponses de mise à jour de chaque tâche.
 */
async function updateTaskPositions(
    boardId: string,
    columnId: string,
    tasks: HTMLElement[]
): Promise<UpdateTaskResponse[]> {
    const orderedTasks = tasks.map((taskElement, newPosition) => {
        const currentTaskId = taskElement.dataset.taskId!;

        return updateTaskPosition(
            boardId,
            columnId,
            currentTaskId,
            newPosition
        );
    });

    return await Promise.all(orderedTasks);
}
