import InputFieldError from '../../../../components/labeledInput/InputFieldError';
import ToggeablePasswordConfirmationField from './ToggeablePasswordConfirmationField';
import Label from '../../../../components/labeledInput/Label';
import AriaInputHelp from '../../../../components/labeledInput/AriaInputHelp';

function PasswordInputConfirmation(): HTMLDivElement {
    const path = window.location.pathname;

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('passconf', 'Confirmer le mot de passe');
    inputContainer.appendChild(labelContainer);

    const toggleablePasswordField = ToggeablePasswordConfirmationField();
    inputContainer.appendChild(toggleablePasswordField);

    if (path === '/register') {
        const ariaInputHelp = AriaInputHelp(
            'password-help',
            'Le mot de passe doit contenir au moins 8 caractères, une majuscule, un chiffre et un caractère spécial.'
        );
        inputContainer.appendChild(ariaInputHelp);
        const inputPasswordContainer =
            toggleablePasswordField.querySelector('#password');

        inputPasswordContainer?.addEventListener('focus', () => {
            ariaInputHelp.classList.remove('hidden');
        });
        inputPasswordContainer?.addEventListener('blur', () => {
            ariaInputHelp.classList.add('hidden');
        });
    }

    const errorField = InputFieldError('error-passconf');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default PasswordInputConfirmation;
