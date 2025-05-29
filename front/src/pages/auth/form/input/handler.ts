function handlePasswordToggle(
    inputField: HTMLInputElement,
    passwordToggleIcon: HTMLElement
): void {
    const isPassword = inputField.type === 'password';
    if (isPassword) {
        inputField.type = 'text';
    } else {
        inputField.type = 'password';
    }

    passwordToggleIcon.classList.toggle('fa-eye-slash');
    passwordToggleIcon.classList.toggle('fa-eye');
}

export default handlePasswordToggle;
