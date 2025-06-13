import { Column } from '../../types/column';
import { goTo } from '../../utils/navigation';

function TaskElement(boardId: string, column: Column): HTMLElement {
    const taskContainer = document.createElement('section');
    taskContainer.classList.add('task-container');

    // Je crée un bouton de création de tâche
    const addBtnTask = document.createElement('button');
    addBtnTask.classList.add('add-task-btn');
    addBtnTask.textContent = '+ Ajouter une tâche';
    taskContainer.appendChild(addBtnTask);

    addBtnTask.addEventListener('click', () =>
        goTo(`/board?boardId=${boardId}&columnId=${column.id}&create-task=true`)
    );

    // Je crée une liste de tâches pour la colonne
    const tasksList = document.createElement('ul');
    tasksList.id = `task-list-${column.id}`;
    taskContainer.appendChild(tasksList);

    return taskContainer;
}

export default TaskElement;
