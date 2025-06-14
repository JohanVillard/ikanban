import addAriaHelpToInput from './AddArialHelpToInput';
import Input from './Input';
import InputFieldError from './InputFieldError';
import Label from './Label';
import './labeledInput.css';

function NameInput(label: string): HTMLDivElement {
    const path = window.location.pathname;

    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('name', label);
    inputContainer.appendChild(labelContainer);

    const inputField = Input('text', 'name');
    inputContainer.appendChild(inputField);

    const ariaDataPathMapping: Record<string, string> = {
        '/register': 'Exemple : Mon projet',
        '/create-board': 'Exemple : Mon projet',
        '/board': 'Exemple : Mon projet',
        // ToDo: Ajouter les descriptions d'aide pour les autres chemins
    };

    const helpText = ariaDataPathMapping[path];
    if (helpText) {
        const ariaInputHelp = addAriaHelpToInput(inputField, 'name', helpText);
        inputContainer.appendChild(ariaInputHelp);
    }

    const errorField = InputFieldError('error-name');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default NameInput;
