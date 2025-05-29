import ToggleablePasswordField from './ToggleablePasswordField';
import InputFieldError from '../../../../components/labeledInput/InputFieldError';
import Label from '../../../../components/labeledInput/Label';
import AriaInputHelp from '../../../../components/labeledInput/AriaInputHelp';

function PasswordInput(): HTMLDivElement {
    const path = window.location.pathname;

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('password', 'Mot de passe');
    inputContainer.appendChild(labelContainer);

    const toggleablePasswordField = ToggleablePasswordField();
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

    const errorField = InputFieldError('error-password');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default PasswordInput;
