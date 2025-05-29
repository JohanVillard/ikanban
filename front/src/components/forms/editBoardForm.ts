import { fetchBoardById, updateBoard } from '../../services/boardServices';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import { goTo } from '../../utils/navigation';
import CancelBtn from '../buttons/CancelBtn';
import EditBtn from '../buttons/EditBtn';
import NameInput from '../labeledInput/NameInput';
import ErrorContainer from '../messageContainer/ErrorContainer';
import ValidationContainer from '../messageContainer/ValidationContainer';

async function editBoardForm(cssSelector: string) {
    const container = document.querySelector(cssSelector);
    if (container) {
        const editForm = document.createElement('form');
        editForm.id = 'edit-form';
        container.appendChild(editForm);

        const params = new URLSearchParams(window.location.search);
        const boardId = params.get('boardId');
        if (!boardId) {
            console.error("L'id du tableau n'a pas pu être récupéré");
            return;
        }

        // Je récupère le tableau et son nom
        const board = await fetchBoardById(boardId);
        const boardName = board.name;

        editForm.appendChild(NameInput('Modifiez le nom du tableau'));

        const editInput = document.querySelector<HTMLInputElement>('#name');
        if (!editInput) {
            console.log(`Le conteneur editInput n'a pas été trouvé`);
            return;
        }
        // J'affiche dans le champ de saisie le nom du tableau
        editInput.value = boardName;

        // Je communique le résultat de la soumission
        editForm.appendChild(ValidationContainer());
        editForm.appendChild(ErrorContainer());

        // Je crée les boutons de commandes
        editForm.appendChild(EditBtn());
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = editInput.value;

            cleanFormErrorMsg();
            const isDataValid = handleFrontValidationError({ name: name });
            if (isDataValid) {
                const result = await updateBoard(boardId, name);

                handleFormResponse(result);

                if (result.success) goTo('/boards');
            }
        });

        const cancelBtn = CancelBtn('Annuler');
        editForm.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () => goTo('/boards'));
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default editBoardForm;
