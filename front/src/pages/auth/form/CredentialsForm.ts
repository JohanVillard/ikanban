import NameInput from '../../../components/labeledInput/NameInput';
import PasswordInput from './input/PasswordInput';
import handleSubmitFormData from '../../../components/forms/submitForm';
import ValidationContainer from '../../../components/messageContainer/ValidationContainer';
import ErrorContainer from '../../../components/messageContainer/ErrorContainer';
import '../../../components/forms/forms.css';
import SubmitBtn from '../../../components/buttons/SubmitBtn';
import CancelBtn from '../../../components/buttons/CancelBtn';
import EmailInput from './input/EmailInput';
import { goBack } from '../../../utils/navigation';
import DeleteBtn from '../../../components/buttons/DeleteBtn';
import handleDeleteUser from './input/handleDeleteUser';
import PasswordInputConfirmation from './input/PasswordInputConfirmation';

function CredentialsForm(cssSelector: string): void {
    const container = document.querySelector(cssSelector);
    if (container) {
        const credentialsForm = document.createElement('form');
        credentialsForm.classList.add('forms');
        container.appendChild(credentialsForm);

        // Je crée les boutons correspondant à la page visitée
        const path = window.location.pathname;
        if (path === '/register' || path === '/profile') {
            credentialsForm.appendChild(NameInput('Nom'));
        }

        credentialsForm.appendChild(EmailInput());

        //TODO: Je dois trouver une méthode de changement de mot de passe
        if (path !== '/profile') {
            credentialsForm.appendChild(PasswordInput());
        }

        if (path === '/register') {
            credentialsForm.appendChild(PasswordInputConfirmation());
        }

        credentialsForm.appendChild(ValidationContainer());
        credentialsForm.appendChild(ErrorContainer());

        // Je crée un button de soumission en fonction de la route
        const submitBtnTexts: Record<string, string> = {
            '/login': 'Se connecter',
            '/register': "S'enregistrer",
            '/profile': 'Modifier',
        };
        const bntText = submitBtnTexts[path];
        credentialsForm.appendChild(SubmitBtn(bntText));
        handleSubmitFormData(credentialsForm);

        if (path === '/profile') {
            const cancelBtn = CancelBtn('Annuler');
            credentialsForm.appendChild(cancelBtn);
            cancelBtn.addEventListener('click', goBack);

            const deleteBtn = DeleteBtn();
            credentialsForm.appendChild(deleteBtn);
            deleteBtn.addEventListener('click', handleDeleteUser);
        }
    } else {
        console.error(`Le conteneur ${cssSelector} n'a pas été trouvé.`);
    }
}

export default CredentialsForm;
