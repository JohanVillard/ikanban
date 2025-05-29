import addAriaHelpToInput from './AddArialHelpToInput';
import InputFieldError from './InputFieldError';
import Label from './Label';
import './labeledInput.css';

function DescriptionInput(label: string): HTMLDivElement {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('description', label);
    inputContainer.appendChild(labelContainer);

    const inputField = document.createElement('textarea');
    inputField.id = 'description';
    inputField.classList.add('create-input');
    inputField.rows = 10;
    inputContainer.appendChild(inputField);

    const helpText = 'Exemple :  Finaliser le dossier';
    const ariaInputHelp = addAriaHelpToInput(
        inputField,
        'description',
        helpText
    );
    inputContainer.appendChild(ariaInputHelp);

    const errorField = InputFieldError('error-description');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default DescriptionInput;
