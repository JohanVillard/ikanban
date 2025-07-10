import { Column } from '../../types/column';
import { Task } from '../../types/task';
import { goTo } from '../../utils/navigation';
import { HandleDragEnd, HandleDragStart } from './handlers';
import './taskItem.css';

/**
 * Crée un élément de liste représentant une tâche draggable pour le tableau Kanban.
 *
 * @param task - La tâche à représenter
 * @param boardId - L'identifiant du tableau auquel appartient la tâche
 * @param column - La colonne contenant la tâche
 * @returns L'élément `<li>` représentant la tâche avec gestion du drag & drop
 */
function TaskItem(task: Task, boardId: string, column: Column): HTMLLIElement {
    // 1. Création l'élément de tâche (li) et le rend déplaçable
    const taskItem = document.createElement('li');
    taskItem.classList.add('draggable-task');
    taskItem.setAttribute('draggable', 'true');

    // 2. Ajout des attributs data-* pour l’identification en KebabCase
    taskItem.setAttribute('data-task-id', task.id);
    taskItem.setAttribute('data-task-column-id', task.columnId);

    // 3. Ajout d'une zone de prise pour indiquer le glisser-déposer
    const grabZone = document.createElement('div');
    grabZone.classList.add('grab-zone');
    taskItem.appendChild(grabZone);

    // 4. Ajoute un bouton cliquable avec le nom de la tâche
    const taskBtn = document.createElement('button');
    taskBtn.textContent = task.name;
    taskBtn.classList.add('task-button');
    taskBtn.addEventListener('click', () => {
        const path = `/board?boardId=${boardId}&columnId=${column.id}&taskId=${task.id}&edit-task=true`;
        goTo(path);
    });
    taskItem.appendChild(taskBtn);

    // 5. Applique le style selon le statut de la tâche (faite ou non)
    const isDone = task.done;
    taskItem.classList.toggle('task-item-is-done', isDone);
    taskItem.classList.toggle('task-item-not-done', !isDone);
    taskBtn.classList.toggle('task-item-is-done', isDone);
    taskBtn.classList.toggle('task-item-not-done', !isDone);

    // 6. Active les événements de glisser-déposer
    taskItem.addEventListener('dragstart', HandleDragStart);
    taskItem.addEventListener('dragend', HandleDragEnd);

    return taskItem;
}

export default TaskItem;
