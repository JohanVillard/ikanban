import ColumnElement from '../../components/columns/ColumnElement';
import Header from '../../components/header/Header';
import {
    HandleDragDrop,
    HandleDragOver,
} from '../../components/taskItem/handlers';
import renderTasksInColumn from '../../components/taskItem/renderTasksInColumn';
import TaskElement from '../../components/taskItem/TaskElement';
import { fetchBoardById } from '../../services/boardServices';
import { getColumnsByBoardId } from '../../services/columnService';
import { goTo } from '../../utils/navigation';
import './board.css';

async function boardPage(boardId: string): Promise<void> {
    if (!boardId) {
        console.error("L'id du tableau n'a pas été trouvé.");
        return;
    }

    const appContainer = document.querySelector('#app');
    if (!appContainer) return;

    // Récupère les données du tableau en fonction de son ID
    const board = await fetchBoardById(boardId);

    // Ajoute le header de l'app
    const header = Header(board.name);
    appContainer.appendChild(header);

    // Crée un conteneur principal pour le tableau
    const boardContainer = document.createElement('section');
    boardContainer.classList.add('board-container'); // Bouton pour le bureau
    appContainer.appendChild(boardContainer);

    const createBoardBtnDesktop = document.createElement('button');
    createBoardBtnDesktop.id = 'create-board-btn';
    createBoardBtnDesktop.textContent = '+ Nouvel colonne';
    createBoardBtnDesktop.addEventListener('click', () =>
        goTo(`/board?boardId=${boardId}&create-column=true`)
    );
    boardContainer.appendChild(createBoardBtnDesktop);

    if (board) {
        const result = await getColumnsByBoardId(boardId);
        if (!result.success) {
            console.error("Aucune colonne n'a été trouvé");
            return;
        }
        // Si ok, je récupère la liste des colonnes dans l'objet APISuccess
        const columns = result.data || [];

        // Je crée un conteneur pour les colonnes
        const columnContainer = document.createElement('div');
        columnContainer.classList.add('column-container');

        // Je boucle à travers les colonnes du tableau et les ajoute au conteneur
        // Utilisation de for of au lieu de forEach, car compatible avec l'asynchronicité
        for (const column of columns) {
            const columnElement = ColumnElement(column, boardId);
            columnContainer.appendChild(columnElement);

            // Je crée le conteneur de tâche
            const taskContainer = TaskElement(boardId, column);
            columnElement.appendChild(taskContainer);

            // et récupère le conteneur de la liste qui s'imbrique dedans
            const tasksList =
                taskContainer.querySelector<HTMLUListElement>('.task-list');

            // J'autorise le drop dans la liste des tâches
            tasksList?.addEventListener('dragover', HandleDragOver);

            await renderTasksInColumn(boardId, column, tasksList);

            tasksList?.addEventListener(
                'drop',
                HandleDragDrop(boardId, column.id)
            );
        }

        boardContainer.appendChild(columnContainer);
    } else {
        // Si le tableau n'est pas trouvé, affiche un message d'erreur
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Tableau non trouvé.';
        boardContainer.appendChild(errorMessage);
    }
}

export default boardPage;
