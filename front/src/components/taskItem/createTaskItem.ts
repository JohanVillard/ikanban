import { Column } from '../../types/column';
import { Task } from '../../types/task';
import { HandleDragEnd, HandleDragStart } from './handlers';
import './taskItem.css';

function TaskItem(task: Task, boardId: string, column: Column): HTMLLIElement {
    const taskItem = document.createElement('li');
    taskItem.classList.add('draggable-task');
    taskItem.setAttribute('draggable', 'true'); // Cet item peut être déplacer avec la souris
    taskItem.setAttribute('data-task-id', task.id);
    taskItem.setAttribute('data-task-column-id', task.columnId);

    // Je crée une pseudo poignet pour visualer le grab
    const grabZone = document.createElement('div');
    grabZone.classList.add('grab-zone');
    taskItem.appendChild(grabZone);

    // puis un bouton pour afficher et accéder à la tâche
    const taskBtn = document.createElement('button');
    taskBtn.textContent = task.name;
    taskBtn.classList.add('task-button');
    taskBtn.addEventListener('click', () => {
        window.location.href = `/board?boardId=${boardId}&columnId=${column.id}&taskId=${task.id}&edit-task=true`;
    });
    taskItem.appendChild(taskBtn);

    // Je switch de couleur le conteneur et son bouton suivant le statut
    const isDone = task.done;
    taskItem.classList.toggle('task-item-is-done', isDone);
    taskItem.classList.toggle('task-item-not-done', !isDone);
    taskBtn.classList.toggle('task-item-is-done', isDone);
    taskBtn.classList.toggle('task-item-not-done', !isDone);

    taskItem.addEventListener('dragstart', HandleDragStart);
    taskItem.addEventListener('dragend', HandleDragEnd);

    return taskItem;
}

export default TaskItem;
