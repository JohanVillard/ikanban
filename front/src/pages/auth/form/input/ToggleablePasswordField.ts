import Input from '../../../../components/labeledInput/Input';
import PasswordToggleButton from './PasswordToggleButton';

function ToggleablePasswordField(): HTMLDivElement {
    const input = Input('password', 'password');

    const passwordToggleBtn = PasswordToggleButton(input);

    // Je crée un conteneur pour positionner le champ de saisie et le bouton
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('input-wrapper');
    inputWrapper.appendChild(input);
    inputWrapper.appendChild(passwordToggleBtn);

    return inputWrapper;
}

export default ToggleablePasswordField;
