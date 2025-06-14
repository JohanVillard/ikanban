import { ColumnCommandsArgs } from '../../types/column';
import DeleteColumnBtn from './DeleteColumnBtn';
import EditColumnBtn from './EditColumnBtn';

function ColumnCommands(
    columnCommandsArgs: ColumnCommandsArgs
): HTMLDivElement {
    // 1. Extraction des arguments
    const { columnHeader, column, boardId, columnElement } = columnCommandsArgs;

    // 2. Conteneur de commandes
    const columnCmd = document.createElement('div');
    columnCmd.id = 'column-cmd';
    columnHeader.appendChild(columnCmd);

    // 3. Boutons
    columnCmd.appendChild(EditColumnBtn(boardId, column.id));
    columnCmd.appendChild(DeleteColumnBtn(column, boardId, columnElement));

    return columnCmd;
}

export default ColumnCommands;
