import { createColumn } from '../../services/columnService';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import CancelBtn from '../buttons/CancelBtn';
import SubmitBtn from '../buttons/SubmitBtn';
import NameInput from '../labeledInput/NameInput';
import { goTo } from '../../utils/navigation';
import WipInput from '../labeledInput/WipInput';
import MessageContainer from '../messageContainer/MessageContainer';

function createColumnForm(cssSelector: string): void {
    const container = document.querySelector(cssSelector);
    if (container) {
        const params = new URLSearchParams(window.location.search);
        const boardId = params.get('boardId');
        if (!boardId) {
            console.error("Le tableau n'a pas été trouvé.");
            return;
        }

        // Je crée le formulaire
        const createForm = document.createElement('form');
        createForm.id = 'create-form';
        container.appendChild(createForm);

        createForm.appendChild(NameInput('Entrez le nom de la colonne'));
        createForm.appendChild(WipInput('Entrez le nombre maximum de tâches'));

        // Je communique le résultat de la soumission
        createForm.appendChild(MessageContainer('validation'));
        createForm.appendChild(MessageContainer('error'));

        // Je crée le bouton d'ajout de projet
        createForm.appendChild(SubmitBtn('Créer'));

        // J'attache le formulaire à l'évènement submit
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Je récupère la valeur dans le champ de saisie
            const createInput =
                document.querySelector<HTMLInputElement>('.input-field');
            const wipInput = document.querySelector<HTMLInputElement>('#wip');

            const name = createInput?.value;
            const wip = wipInput?.value;

            cleanFormErrorMsg();

            const isDataValid = handleFrontValidationError({
                name: name,
                wip: wip,
            });
            if (isDataValid) {
                const result = await createColumn(
                    boardId,
                    name || '',
                    wip || ''
                );
                handleFormResponse(result);
                if (result.success) goTo(`/board?boardId=${boardId}`);
            }
        });

        // Je crée et définis le comportement du bouton Annuler
        const cancelBtn = CancelBtn('Annuler');
        createForm.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () =>
            goTo(`/board?boardId=${boardId}`)
        );
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default createColumnForm;
