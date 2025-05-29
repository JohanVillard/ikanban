import {
    ApiFailure,
    ApiSuccess,
    ApiSuccessData,
    FormResponse,
    ValidationError,
} from '../types/api';

export function cleanFormErrorMsg() {
    cleanValidatioErrorMsg();
    cleanAPIErrorMsg();
}

export function cleanValidatioErrorMsg() {
    // Je supprime les erreurs de validation à l'écran
    const errorFields = [
        { id: '#name', class: '.error-name' },
        { id: '#email', class: '.error-email' },
        { id: '#password', class: '.error-password' },
        { id: '#passconf', class: '.error-passconf' },
    ];

    errorFields.forEach((field) => {
        const errorMsg = document.querySelector(field.class);
        if (errorMsg) errorMsg.textContent = '';

        const input = document.querySelector(field.id);
        input?.removeAttribute('aria-invalid');
    });
}

export function cleanAPIErrorMsg() {
    // Je supprime les erreurs de L'API à l'écran
    const errorContainer = document.querySelector('#form-error');
    if (errorContainer) errorContainer.textContent = '';
    errorContainer?.removeAttribute('aria-invalid');

    const validationContainer = document.querySelector('#form-validation');
    if (validationContainer) validationContainer.textContent = '';
}

export function handleFormResponse(result: FormResponse) {
    // SUCCÈS
    if (result.success === true) {
        handleSuccessMsg(result);

        // ERREUR DE VALIDATION
    } else if ('errors' in result) {
        handleValidationError(result);
        // ECHEC DE L'API
    } else if ('error' in result) {
        handleAPIError(result);
    }
}

export function handleSuccessMsg(result: ApiSuccess<ApiSuccessData>) {
    const validationContainer = document.querySelector('#form-validation');
    if (validationContainer) {
        validationContainer.textContent = result.message || '';
    }
}

function handleValidationError(result: ValidationError): void {
    const errors = result.errors;
    const inputLabels = [
        { label: 'name' },
        { label: 'email' },
        { label: 'password' },
        { label: 'passconf' },
        { label: 'description' },
    ];

    inputLabels.forEach((input) => {
        const label = input.label;

        if (errors[label]) {
            const errorMsg = document.querySelector(`.error-${label}`);
            if (errorMsg) {
                errorMsg.textContent = errors[label].msg || '';
            }

            const actualInput = document.querySelector(`#${label}`);
            actualInput?.setAttribute('aria-invalid', 'true');
        }
    });
}

function handleAPIError(result: ApiFailure): void {
    const errorContainer = document.querySelector('#form-error');
    if (errorContainer) {
        const message = result.error;

        errorContainer.textContent = message;
    }
}
