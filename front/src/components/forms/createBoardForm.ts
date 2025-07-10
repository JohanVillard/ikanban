import { createBoard } from '../../services/boardServices';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import CancelBtn from '../buttons/CancelBtn';
import SubmitBtn from '../buttons/SubmitBtn';
import NameInput from '../labeledInput/NameInput';
import { goTo } from '../../utils/navigation';
import MessageContainer from '../messageContainer/MessageContainer';

function createBoardForm(cssSelector: string): void {
    // 1. Récupération de la section
    const container = document.querySelector(cssSelector);
    if (container) {
        // Je crée le formulaire
        const createForm = document.createElement('form');
        createForm.classList.add('forms');
        container.appendChild(createForm);

        // J'attache le champ de saisie au formulaire
        createForm.appendChild(NameInput('Entrez le nom du tableau'));

        // Je communique le résultat de la soumission
        createForm.appendChild(MessageContainer('validation'));
        createForm.appendChild(MessageContainer('error'));

        // Je crée le bouton d'ajout de projet
        createForm.appendChild(SubmitBtn('Créer'));

        // J'attache le formulaire à l'évènement submit
        createForm.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            // Je récupère la valeur dans le champ de saisie
            const createInput =
                document.querySelector<HTMLInputElement>('.input-field');

            const name = createInput?.value;

            cleanFormErrorMsg();

            // Je valide les données niveau front
            const isDataValid = handleFrontValidationError({ name: name });
            if (isDataValid) {
                const result = await createBoard(name || '');
                // et niveau back
                handleFormResponse(result);
                if (result.success) goTo('/boards');
            }
        });

        // Je crée et défini le comportement du bouton Annuler
        const cancelBtn = CancelBtn('Annuler');
        createForm.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => goTo('/boards'));
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default createBoardForm;
