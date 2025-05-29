import { createColumn } from '../../services/columnService';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import ErrorContainer from '../messageContainer/ErrorContainer';
import ValidationContainer from '../messageContainer/ValidationContainer';
import CancelBtn from '../buttons/CancelBtn';
import SubmitBtn from '../buttons/SubmitBtn';
import NameInput from '../labeledInput/NameInput';
import { goTo } from '../../utils/navigation';

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

        // Je communique le résultat de la soumission
        createForm.appendChild(ValidationContainer());
        createForm.appendChild(ErrorContainer());

        // Je crée le bouton d'ajout de projet
        createForm.appendChild(SubmitBtn('Créer'));

        // J'attache le formulaire à l'évènement submit
        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Je récupère la valeur dans le champ de saisie
            const createInput =
                document.querySelector<HTMLInputElement>('.input-field');

            const name = createInput?.value;

            cleanFormErrorMsg();

            const isDataValid = handleFrontValidationError({ name: name });
            if (isDataValid) {
                const result = await createColumn(boardId, name || '');

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
