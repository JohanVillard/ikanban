import { createColumn } from '../../services/columnService';
import { goTo } from '../../utils/navigation';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';

/**
 * Gère la création d'une colonne à partir du formulaire.
 *
 * @param e - L'événement de soumission du formulaire.
 * @param boardId - L'identifiant du tableau auquel ajouter la colonne.
 * @param boardPath - Le chemin vers la page du tableau pour redirection.
 */
async function handleCreateColumn(
    e: Event,
    boardId: string,
    boardPath: string
): Promise<void> {
    // 1. Empêche l'action automatique
    e.preventDefault();

    // 2. Récupère les valeurs des champs de saisie
    const createInput =
        document.querySelector<HTMLInputElement>('.input-field');
    const wipInput = document.querySelector<HTMLInputElement>('#wip');

    const name = createInput?.value;
    const wip = wipInput?.value;

    // 3. Nettoyage des messages d'erreurs
    cleanFormErrorMsg();

    // 4. Validation des entrées
    const isDataValid = handleFrontValidationError({
        name: name,
        wip: wip,
    });

    // 5. Création et retour au tableau
    if (isDataValid) {
        const result = await createColumn(boardId, name || '', wip || '');
        handleFormResponse(result);
        if (result.success) goTo(boardPath);
    }
}

export default handleCreateColumn;
