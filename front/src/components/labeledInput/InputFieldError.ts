function InputFieldError(errorClass: string): HTMLDivElement {
    const errorField = document.createElement('div');
    errorField.classList.add('error-input', errorClass);
    errorField.setAttribute('aria-live', 'polite'); // Permet aux lecteur d'écran d'annoncer les erreurs

    return errorField;
}

export default InputFieldError;
