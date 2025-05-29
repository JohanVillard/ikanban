import AriaInputHelp from '../../../../components/labeledInput/AriaInputHelp';
import Input from '../../../../components/labeledInput/Input';
import InputFieldError from '../../../../components/labeledInput/InputFieldError';
import Label from '../../../../components/labeledInput/Label';

function EmailInput(): HTMLDivElement {
    const path = window.location.pathname;
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('email', 'Adresse e-mail');
    inputContainer.appendChild(labelContainer);

    const inputField = Input('email', 'email');
    inputContainer.appendChild(inputField);

    if (path === '/register') {
        const ariaInputHelp = AriaInputHelp(
            'email-help',
            'Exemple: nom@exemple.fr'
        );
        inputContainer.appendChild(ariaInputHelp);

        inputField?.addEventListener('focus', () => {
            ariaInputHelp.classList.remove('hidden');
        });
        inputField?.addEventListener('blur', () => {
            ariaInputHelp.classList.add('hidden');
        });
    }

    const errorField = InputFieldError('error-email');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default EmailInput;
