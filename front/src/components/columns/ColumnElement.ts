import { Column } from '../../types/column';
import { goTo } from '../../utils/navigation';
import { handleDeleteColumn } from './handler';

function ColumnElement(column: Column, boardId: string): HTMLElement {
    const columnElement = document.createElement('section');
    columnElement.classList.add('column');

    // Je crée un conteneur pour le titre et les icones
    const columnHeader = document.createElement('div');
    columnHeader.id = 'column-header';
    columnElement.appendChild(columnHeader);

    // Je crée le titre de la colonne
    const columnTitle = document.createElement('h2');
    columnTitle.textContent = column.name;
    columnHeader.appendChild(columnTitle);

    // Et un conteneur pour la contrôller
    const columnCmd = document.createElement('div');
    columnCmd.id = 'column-cmd';
    columnHeader.appendChild(columnCmd);

    // Je crée le bouton de modification
    const columnEditButton = document.createElement('button');
    columnEditButton.classList.add('update-column-btn');
    columnCmd.appendChild(columnEditButton);

    // Ajout d'un label accessible (aria-label) pour les lecteurs d'écran
    columnEditButton.setAttribute('aria-label', 'Modifier la colonne');
    columnEditButton.setAttribute('title', 'Modifier la colonne');

    // Et son icône correspondante
    const columnEditIcon = document.createElement('i');
    columnEditIcon.classList.add('fas', 'fa-edit');
    columnEditButton.appendChild(columnEditIcon);
    columnEditButton.addEventListener('click', () =>
        goTo(`/board?boardId=${boardId}&columnId=${column.id}&edit-column=true`)
    );

    // On indique que l'icône est décorative pour ne pas la lire 2 fois
    columnEditIcon.setAttribute('aria-hidden', 'true');

    // Je crée le bouton de suppression
    const columnDeleteButton = document.createElement('button');
    columnDeleteButton.classList.add('delete-column-btn');
    columnCmd.appendChild(columnDeleteButton);

    // Ajout d'un label accessible (aria-label) pour les lecteurs d'écran
    columnDeleteButton.setAttribute('aria-label', 'Supprimer la colonne');
    columnDeleteButton.setAttribute('title', 'Supprimer la colonne');

    // Et son icône correspondante
    const columnDeleteIcon = document.createElement('i');
    columnDeleteIcon.classList.add('fas', 'fa-trash');
    columnDeleteButton.appendChild(columnDeleteIcon);

    // On indique que l'icône est décorative pour ne pas la lire 2 fois
    columnDeleteIcon.setAttribute('aria-hidden', 'true');

    columnDeleteButton.addEventListener('click', () =>
        handleDeleteColumn(column, boardId, columnElement)
    );

    // J'ajoute le nombre de tâches autorisées pour cette colonne
    const columnWipDisplay = document.createElement('h3');
    columnWipDisplay.id = `wip-display-${column.id}`;
    if (column.wip) {
        columnWipDisplay.textContent = column.wip.toString();
        columnWipDisplay.dataset.wip = column.wip.toString();
    } else {
        columnWipDisplay.classList.add('fa-solid', 'fa-infinity');
        columnWipDisplay.dataset.wip = '';
    }
    columnElement.appendChild(columnWipDisplay);

    return columnElement;
}

export default ColumnElement;
