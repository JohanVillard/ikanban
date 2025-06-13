import {
    fetchColumnByIdAndBoard,
    updateColumn,
} from '../../services/columnService';
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
import WipInput from '../labeledInput/WipInput';

async function editColumnForm(cssSelector: string) {
    const container = document.querySelector(cssSelector);
    if (container) {
        const editForm = document.createElement('form');
        editForm.id = 'edit-form';
        container.appendChild(editForm);

        const params = new URLSearchParams(window.location.search);
        const boardId = params.get('boardId');
        if (!boardId) return;
        const columnId = params.get('columnId');
        if (!columnId) return;

        // Je récupére la colonne et son nom
        const column = await fetchColumnByIdAndBoard(columnId, boardId);
        const columnName = column.name;
        const oldWip = column.wip;

        editForm.appendChild(NameInput('Modifier le nom de la colonne'));
        const editInput = editForm.querySelector<HTMLInputElement>('#name');
        if (!editInput) {
            console.error(`Le conteneur editInput n'a pas été trouvé`);
            return;
        }
        // J'affiche dans le champ de saisie le nom de la colonne
        editInput.value = columnName;

        editForm.appendChild(WipInput('Entrez le nombre maximum de tâches'));
        const wipInput = editForm.querySelector<HTMLInputElement>('#wip');
        if (!wipInput) {
            console.error(`Le conteneur editInput n'a pas été trouvé`);
            return;
        }
        // J'affiche dans le champ de saisie le nombre de tâche maximum
        wipInput.value = oldWip !== null ? oldWip.toString() : '';

        // Je communique le résultat de la soumission
        editForm.appendChild(ValidationContainer());
        editForm.appendChild(ErrorContainer());

        editForm.appendChild(EditBtn());
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = editInput.value;
            const wip = wipInput.value;

            cleanFormErrorMsg();

            const isDataValid = handleFrontValidationError({
                name: name,
                wip: wip,
            });
            if (isDataValid) {
                const result = await updateColumn(boardId, columnId, name, wip);

                handleFormResponse(result);
                if (result.success) goTo(`/board?boardId=${boardId}`);
            }
        });

        const cancelBtn = CancelBtn('Annuler');
        editForm.appendChild(cancelBtn);
        cancelBtn.addEventListener('click', () =>
            goTo(`/board?boardId=${boardId}`)
        );
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default editColumnForm;
