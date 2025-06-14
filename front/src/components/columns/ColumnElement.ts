import { Column, ColumnCommandsArgs } from '../../types/column';
import ColumnCommands from './ColumnCommands';
import WipElement from './WipElement';

function ColumnElement(column: Column, boardId: string): HTMLElement {
    // 1. Conteneur de la colonne
    const columnElement = document.createElement('section');
    columnElement.classList.add('column');

    // 2. Conteneur de l'en-tête
    const columnHeader = document.createElement('div');
    columnHeader.id = 'column-header';
    columnElement.appendChild(columnHeader);

    // 3. Titre
    const columnTitle = document.createElement('h2');
    columnTitle.textContent = column.name;
    columnHeader.appendChild(columnTitle);

    // 3. Commandes
    const columnCommandsArgs: ColumnCommandsArgs = {
        columnHeader,
        column,
        boardId,
        columnElement,
    };
    columnHeader.appendChild(ColumnCommands(columnCommandsArgs));

    // 4. WIP (Work In Progress)
    columnElement.appendChild(WipElement(column));

    return columnElement;
}

export default ColumnElement;
