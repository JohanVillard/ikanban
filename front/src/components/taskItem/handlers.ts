import {
    updateColumnIdTask,
    updateTaskPosition,
} from '../../services/taskServices';

export function HandleDragOver(e: DragEvent) {
    e.preventDefault();
}

export function HandleDragStart(e: DragEvent) {
    // Je récupère la tâche ciblée
    // Je convertis l'évenement en item de liste
    const taskElement = e.target as HTMLElement;
    const taskId = taskElement.dataset.taskId;
    const columnId = taskElement.dataset.taskColumnId;

    if (taskId && columnId) {
        e.dataTransfer?.setData('taskId', taskId);
        e.dataTransfer?.setData('taskColumnId', columnId);

        taskElement.classList.add('dragging'); // Permet de styliser le déplacement de la tâche
    }
}

export function HandleDragEnd(e: DragEvent) {
    // Je récupère la tâche ciblée
    // Je convertis l'évenement en item de liste
    const taskElement = e.target as HTMLLIElement;

    if (taskElement) {
        taskElement.classList.remove('dragging');
    }
}

export function HandleDragDrop(boardId: string, columnId: string) {
    return async function (e: DragEvent) {
        e.preventDefault();
        console.log('DROP sur colonne', columnId);

        const taskId = e.dataTransfer?.getData('taskId');
        const taskColumnId = e.dataTransfer?.getData('taskColumnId');

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
            console.log("La tâche saisie n'a pas été retrouvée");
            return;
        }

        const tasksList = e.currentTarget as HTMLElement;

        moveTaskInDom(tasksList, draggedTask, e);

        // Je mets à jour l'ID de la colonne dans la BDD
        try {
            if (columnId !== taskColumnId) {
                await updateColumnIdTask(
                    boardId,
                    taskColumnId,
                    taskId,
                    columnId
                );
            }

            // Je récupère la liste des tâches mise à jour dans le DOM
            const orderedTasks = [...tasksList.querySelectorAll('li')];

            await updateTaskPositions(boardId, columnId, orderedTasks);
            // mise à jour des positions récupérées à partir du dom
            // dans la bdd
        } catch (error) {
            console.error(`erreur lors de la mise à jour de la tâche ${error}`);
        }
    };
}

async function moveTaskInDom(
    tasksList: HTMLElement,
    draggedTask: Element,
    e: DragEvent
) {
    // Je récupère toute les tâches dans le DOM sous forme de tableau
    // Sauf celle que j'ai grab
    const allTasks = [...tasksList.querySelectorAll('li')].filter(
        (element) => element !== draggedTask
    );
    console.log(allTasks);

    if (allTasks.length === 0) {
        // Je déplace la tâche si le tableau est vide
        tasksList.appendChild(draggedTask);
    }

    // Je trouve la tâche devant laquelle on va insérer
    // Si la souris est au-dessus du milieu de la tâche,
    // Alors je considère que je dois la mettre avant cette tâche.
    let insertBefore = null;
    for (const task of allTasks) {
        // Je récupère la position de la tâche à l'écran
        const rect = task.getBoundingClientRect();

        // Je compare la position de l'axe vertical de la souris
        // Et le milieu vertical de la tâche
        if (e.clientY < rect.top + rect.height / 2) {
            insertBefore = task;
            break;
        }
    }

    // Insère soit avant, soit à la fin
    if (insertBefore) {
        tasksList.insertBefore(draggedTask, insertBefore);
    } else {
        tasksList.appendChild(draggedTask);
    }
}

async function updateTaskPositions(
    boardId: string,
    columnId: string,
    tasks: HTMLElement[]
) {
    // Je récupère la liste des tâches mis à jour dans le DOM
    // Avec toutes les tâches cette foic ci
    const orderedTasks = tasks.map((taskElement, newPosition) => {
        const currentTaskId = taskElement.dataset.taskId;
        if (!currentTaskId) return;

        return updateTaskPosition(
            boardId,
            columnId,
            currentTaskId,
            newPosition
        );
    });

    await Promise.all(orderedTasks);
}
