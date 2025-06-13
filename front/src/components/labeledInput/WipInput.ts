import addAriaHelpToInput from './AddArialHelpToInput';
import InputFieldError from './InputFieldError';
import Label from './Label';
import './labeledInput.css';

function WipInput(label: string): HTMLDivElement {
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('input-container');

    const labelContainer = Label('wip', label);
    inputContainer.appendChild(labelContainer);

    const inputField = document.createElement('input');
    inputField.type = 'number';
    inputField.id = 'wip';
    inputField.name = 'wip';
    inputField.classList.add('input-field');
    inputContainer.appendChild(inputField);

    const helpText =
        'Détermine le nombre de tâches que peut contenir la colonne. ' +
        'Laissez le champ vide signifie un nombre illimité de tâches.';

    const ariaInputHelp = addAriaHelpToInput(
        inputField,
        'description',
        helpText
    );
    inputContainer.appendChild(ariaInputHelp);

    const errorField = InputFieldError('error-wip');
    inputContainer.appendChild(errorField);

    return inputContainer;
}

export default WipInput;
