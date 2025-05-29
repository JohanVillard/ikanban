import handlePasswordToggle from './handler';

function PasswordToggleButton(inputField: HTMLInputElement): HTMLButtonElement {
    const passwordToggleBtn = document.createElement('button');
    passwordToggleBtn.type = 'button';
    passwordToggleBtn.id = 'password-toggle-button';
    passwordToggleBtn.setAttribute(
        'aria-label',
        'Afficher/Masquer le mot de passe'
    );

    const passwordToggleIcon = document.createElement('i');
    passwordToggleIcon.classList.add('fa-solid', 'fa-eye');

    passwordToggleBtn.appendChild(passwordToggleIcon);

    passwordToggleBtn.addEventListener('click', () => {
        handlePasswordToggle(inputField, passwordToggleIcon);
    });

    return passwordToggleBtn;
}

export default PasswordToggleButton;
