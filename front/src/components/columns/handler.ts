import { deleteColumn } from '../../services/columnService';
import { Column } from '../../types/column';

/**
 * Gère la suppression de la colonne.
 *
 * @param column - La colonne à supprimer.
 * @param boardId - Le tableau propriétaire de la colonne.
 * @param columnElement - L'élément du DOM représentant la colonne.
 */
export async function handleDeleteColumn(
    column: Column,
    boardId: string,
    columnElement: HTMLElement
): Promise<void> {
    // 1. Message de confirmation
    const confirmed = confirm(`Supprimer la colonne ${column.name} ?`);
    if (!confirmed) return;

    // 2. Suppression
    await deleteColumn(boardId, column.id);

    // 3. Mise à jour du DOM
    columnElement.remove();
}
