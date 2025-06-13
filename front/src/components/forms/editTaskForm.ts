import {
    deleteTask,
    fetchTaskInBoardColumn,
    updateTaskDetails,
    updateTaskStatus,
} from '../../services/taskServices';
import {
    cleanFormErrorMsg,
    handleFormResponse,
    handleFrontValidationError,
} from '../../utils/userMessageHandlers';
import { goTo } from '../../utils/navigation';
import EditBtn from '../buttons/EditBtn';
import DescriptionInput from '../labeledInput/DescriptionInput';
import NameInput from '../labeledInput/NameInput';
import ErrorContainer from '../messageContainer/ErrorContainer';
import ValidationContainer from '../messageContainer/ValidationContainer';

async function editTaskForm(cssSelector: string) {
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
        const taskId = params.get('taskId');
        if (!taskId) return;

        const result = await fetchTaskInBoardColumn(taskId, columnId, boardId);
        if ('error' in result) {
            console.error(
                `Erreur lors de la récupération de la tâche : ${result.error}`
            );
            return;
        }

        const task = result?.data;
        const taskName = task?.name;
        const taskDescription = task?.description;

        // Je crée les champs de saisie et j'y insère les valeurs correspondantes
        editForm.appendChild(NameInput('Modifiez le nom de la tâche'));
        const nameInput = document.querySelector<HTMLInputElement>('#name');
        if (!nameInput) {
            console.log(`Le conteneur nameInput n'a pas été trouvé`);
            return;
        }
        nameInput.value = taskName || '';

        editForm.appendChild(
            DescriptionInput('Modifiez la description de la tâche')
        );
        const descriptionInput =
            document.querySelector<HTMLTextAreaElement>('#description');
        if (!descriptionInput) {
            console.log(`Le conteneur descriptionInput n'a pas été trouvé`);
            return;
        }
        descriptionInput.value = taskDescription || '';

        // Je communique le résultat de la soumission
        editForm.appendChild(ValidationContainer());
        editForm.appendChild(ErrorContainer());

        // Je crée les boutons et définis leurs comportements
        editForm.appendChild(EditBtn());
        editForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const taskDetails = {
                name: nameInput.value,
                description: descriptionInput.value,
            };

            cleanFormErrorMsg();

            const result = await updateTaskDetails(
                boardId,
                columnId,
                taskId,
                taskDetails
            );

            const isDataValid = handleFrontValidationError(taskDetails);
            if (isDataValid) {
                handleFormResponse(result);

                if (result.success) goTo(`/board?boardId=${boardId}`);
            }
        });

        // Je crée un bouton d'annulation
        const editBtnCancel = document.createElement('button');
        editBtnCancel.id = 'cancel-btn';
        editBtnCancel.type = 'button';
        editBtnCancel.textContent = 'Annuler';

        // Je crée un bouton de suppression
        const editBtnDelete = document.createElement('button');
        editBtnDelete.id = 'delete-btn';
        editBtnDelete.type = 'button';
        editBtnDelete.textContent = 'Supprimer';

        // Je crée un bouton de validation de tâche
        const editBtnValidate = document.createElement('button');
        editBtnValidate.id = 'validate-btn';
        editBtnValidate.type = 'button';

        if (task === undefined) return;
        const isDone = task.done;
        if (!isDone) {
            editBtnValidate.textContent = 'Terminer la tâche';
        } else {
            editBtnValidate.textContent = 'Reprendre la tâche';
        }
        editBtnValidate.classList.toggle('is-done-btn', isDone);
        editBtnValidate.classList.toggle('is-not-done-btn', !isDone);

        // J'ajoute les éléments au formulaire
        editForm.appendChild(editBtnCancel);
        editForm.appendChild(editBtnDelete);
        editForm.appendChild(editBtnValidate);

        editBtnCancel.addEventListener('click', () =>
            goTo(`/board?boardId=${boardId}`)
        );

        editBtnDelete.addEventListener('click', async () => {
            await deleteTask(boardId, taskId);

            window.location.href = `/board?boardId=${boardId}`;
        });

        editBtnValidate.addEventListener('click', async (e) => {
            e.preventDefault();
            const isDone = task?.done;

            const result = await updateTaskStatus(
                boardId,
                columnId,
                taskId,
                !isDone
            );

            if (!result.success) {
                console.log(
                    'Erreur lors du changement de statut de la tâche: ',
                    result.error
                );
                return;
            }

            // Mets à jour l'objet local si nécessaire
            if (result.data !== undefined) {
                const isNowDone = result.data.done;

                task.done = isNowDone as boolean;

                if (!isNowDone) {
                    editBtnValidate.textContent = 'Terminer la tâche';
                } else {
                    editBtnValidate.textContent = 'Reprendre la tâche';
                }
                editBtnValidate.classList.toggle('is-done-btn', isNowDone);
                editBtnValidate.classList.toggle('is-not-done-btn', !isNowDone);
            }
        });
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default editTaskForm;
