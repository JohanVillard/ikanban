import { Column } from '../../types/column';
import { handleDeleteColumn } from './handler';

function DeleteColumnBtn(
    column: Column,
    boardId: string,
    columnElement: HTMLElement
): HTMLButtonElement {
    // Je crée le bouton de suppression
    const deleteColumnBtn = document.createElement('button');
    deleteColumnBtn.classList.add('delete-column-btn');

    // Ajout d'un label accessible (aria-label) pour les lecteurs d'écran
    deleteColumnBtn.setAttribute('aria-label', 'Supprimer la colonne');
    deleteColumnBtn.setAttribute('title', 'Supprimer la colonne');

    // Et son icône correspondante
    const columnDeleteIcon = document.createElement('i');
    columnDeleteIcon.classList.add('fas', 'fa-trash');
    deleteColumnBtn.appendChild(columnDeleteIcon);

    // On indique que l'icône est décorative pour ne pas la lire 2 fois
    columnDeleteIcon.setAttribute('aria-hidden', 'true');

    deleteColumnBtn.addEventListener('click', () =>
        handleDeleteColumn(column, boardId, columnElement)
    );
    return deleteColumnBtn;
}

export default DeleteColumnBtn;
