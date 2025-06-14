import { goTo } from '../../utils/navigation';

/**
 * Crée un bouton d'édition de la colonne.
 *
 * @param boardId - L'identifiant du tableau propriétaire de la colonne.
 * @param columnId - L'identifiant de la colonne.
 * @returns Un bouton d'éditon de la colonne.
 */
function EditColumnBtn(boardId: string, columnId: string): HTMLButtonElement {
    // 1. Bouton
    const editColumnBtn = document.createElement('button');
    editColumnBtn.classList.add('update-column-btn');

    // 2. Accéssibilité du bouton
    editColumnBtn.setAttribute('aria-label', 'Modifier la colonne');
    editColumnBtn.setAttribute('title', 'Modifier la colonne');

    // 3. Icône et chemin
    const columnEditIcon = document.createElement('i');
    columnEditIcon.classList.add('fas', 'fa-edit');
    editColumnBtn.appendChild(columnEditIcon);
    editColumnBtn.addEventListener('click', () => {
        const editColumnPath = `/board?boardId=${boardId}&columnId=${columnId}&edit-column=true`;
        goTo(editColumnPath);
    });

    // 4. Accéssibilité de l'icône
    columnEditIcon.setAttribute('aria-hidden', 'true');

    return editColumnBtn;
}

export default EditColumnBtn;
