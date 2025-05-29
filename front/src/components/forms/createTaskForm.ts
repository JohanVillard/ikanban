import { createTask } from '../../services/taskServices';
import { cleanFormErrorMsg, handleFormResponse } from '../../utils/DOMManip';
import { goTo } from '../../utils/navigation';
import CancelBtn from '../buttons/CancelBtn';
import SubmitBtn from '../buttons/SubmitBtn';
import DescriptionInput from '../labeledInput/DescriptionInput';
import NameInput from '../labeledInput/NameInput';

async function createTaskForm(cssSelector: string) {
    const container = document.querySelector(cssSelector);
    if (container) {
        const params = new URLSearchParams(window.location.search);
        const boardId = params.get('boardId');
        if (!boardId) return;
        const columnId = params.get('columnId');
        if (!columnId) return;

        // Je crée le formulaire
        const createForm = document.createElement('form');
        createForm.id = 'create-form';
        container.appendChild(createForm);

        createForm.appendChild(NameInput('Entrez le nom de la tâche'));
        createForm.appendChild(
            DescriptionInput('Entrez la description de la tâche')
        );

        createForm.appendChild(SubmitBtn('Créer'));

        createForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const taskName =
                createForm.querySelector<HTMLInputElement>('#name');
            const taskDescription =
                createForm.querySelector<HTMLTextAreaElement>('#description');

            const name = taskName?.value;
            const description = taskDescription?.value;
            const taskDetails = { name: name, description: description };

            const result = await createTask(boardId, columnId, taskDetails);

            cleanFormErrorMsg();
            handleFormResponse(result);
            if (result.success) goTo(`/board?boardId=${boardId}`);
        });

        const cancelBtn = createForm.appendChild(CancelBtn('Annuler'));
        cancelBtn.addEventListener('click', () =>
            goTo(`/board?boardId=${boardId}`)
        );
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default createTaskForm;
