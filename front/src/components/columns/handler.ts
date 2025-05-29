import { deleteColumn } from '../../services/columnService';
import { Column } from '../../types/column';

export async function handleDeleteColumn(
    column: Column,
    boardId: string,
    columnElement: HTMLElement
): Promise<void> {
    // Je crée un fenêtre de confirmation de l'utilisateur
    const confirmed = confirm(`Supprimer la colonne ${column.name} ?`);
    if (!confirmed) return;

    await deleteColumn(boardId, column.id);

    // Je mets à jour le DOM en retirant la node supprimée
    columnElement.remove();
}
