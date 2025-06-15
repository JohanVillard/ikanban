import CancelBtn from '../buttons/CancelBtn';
import SubmitBtn from '../buttons/SubmitBtn';
import NameInput from '../labeledInput/NameInput';
import { goTo } from '../../utils/navigation';
import WipInput from '../labeledInput/WipInput';
import MessageContainer from '../messageContainer/MessageContainer';
import handleCreateColumn from './handlers';

/**
 * Crée un conteneur du formulaire de création de tableau.
 *
 * @param cssSelector - Le selecteur CSS du parent auquel il est attaché.
 */
function createColumnForm(cssSelector: string): void {
    // 1. Récupération de la section
    const container = document.querySelector<HTMLElement>(cssSelector);
    if (!container) {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
        return;
    }

    // 2. Récupation de l'identifiant du tableau
    const boardId = getBoardId();
    if (!boardId) {
        throw new Error("Le tableau n'a pas été trouvé");
    }

    // 3. Chemin du tableau
    const boardPath = `/board?boardId=${boardId}`;

    // 4. Formulaire
    container?.appendChild(buildColumnForm(boardId, boardPath));
}

export default createColumnForm;

/**
 * Récupère l'identifiant du tableau dans l'URL.
 *
 * @returns L'identifiant du tableau ou null si il est absent.
 */
function getBoardId(): string | null {
    const params = new URLSearchParams(window.location.search);
    const boardId = params.get('boardId');

    return boardId;
}

/**
 * Construit le formulaire de création de colonne.
 * @param boardId - L'identifiant du tableau.
 * @param boardPath - Le chemin vers le tableau.
 * @returns le formulaire HTML.
 */
function buildColumnForm(boardId: string, boardPath: string): HTMLFormElement {
    // 1. Formulaire
    const createForm = document.createElement('form');
    createForm.id = 'create-form';

    // 2. Champs de saisie
    createForm.appendChild(NameInput('Entrez le nom de la colonne'));
    createForm.appendChild(WipInput('Entrez le nombre maximum de tâches'));

    // 3. Conteneur de message
    createForm.appendChild(MessageContainer('validation'));
    createForm.appendChild(MessageContainer('error'));

    // 4. Boutons
    createForm.appendChild(SubmitBtn('Créer'));
    createForm.addEventListener('submit', (e) =>
        handleCreateColumn(e, boardId, boardPath)
    );

    const cancelBtn = CancelBtn('Annuler');
    createForm.appendChild(cancelBtn);
    cancelBtn.addEventListener('click', () => goTo(boardPath));

    return createForm;
}
