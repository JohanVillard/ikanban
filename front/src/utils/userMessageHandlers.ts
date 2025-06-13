import {
    ApiFailure,
    ApiSuccess,
    ApiSuccessData,
    FormResponse,
    ValidationError,
} from '../types/api';
import { JsFormData } from '../types/validation';
import { testPassword } from './utils';
import { inputLabels, validationRules } from './validationRules';

export function cleanFormErrorMsg() {
    cleanValidatioErrorMsg();
    cleanAPIErrorMsg();
}

export function cleanValidatioErrorMsg() {
    // Je supprime les erreurs de validation à l'écran
    inputLabels.forEach((label) => {
        const errorMsg = document.querySelector(`.error-${label}`);
        if (errorMsg) errorMsg.textContent = '';

        const input = document.querySelector(`#${label}`);
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
        handleBackValidationError(result);
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

function handleBackValidationError(result: ValidationError): void {
    const errors = result.errors;

    inputLabels.forEach((label) => {
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

export function handleFrontValidationError(jsFormData: JsFormData): boolean {
    let isValid = true;

    for (const rule of validationRules) {
        const label = rule.label;
        const value = jsFormData[label as keyof JsFormData] || '';
        const actualInput = document.querySelector(`#${label}`);
        const errorMsg = document.querySelector(`.error-${label}`);
        console.log(rule.label);
        if (!errorMsg) continue;

        // Je vérifie si la règle existe puis sa validité
        if (rule.notEmpty && !value) {
            errorMsg.textContent = rule.errorMessages?.notEmpty || '';
            actualInput?.setAttribute('aria-invalid', 'true');
            isValid = false;
            continue;
        }

        if (rule.minLength && value.length < rule.minLength) {
            errorMsg.textContent = rule.errorMessages?.minLength || '';
            actualInput?.setAttribute('aria-invalid', 'true');
            isValid = false;
            continue;
        }

        if (rule.pattern) {
            // Je crée un objet RegExp pour tester la correspondance avec le pattern d'un email
            // L'option i permet d'ignorer la casse
            const pattern = new RegExp(rule.pattern, 'i');
            const isPatternValid = pattern.test(value);
            if (!isPatternValid) {
                errorMsg.textContent = rule.errorMessages?.pattern || '';
                actualInput?.setAttribute('aria-invalid', 'true');
                isValid = false;
                continue;
            }
        }

        if (rule.isStrongPassword) {
            const isPasswordValid = testPassword(value, rule.isStrongPassword);
            if (!isPasswordValid) {
                errorMsg.textContent =
                    rule.errorMessages?.isStrongPassword || '';
                actualInput?.setAttribute('aria-invalid', 'true');
                isValid = false;
                continue;
            }
        }

        if (rule.matchWith) {
            const password = jsFormData['password'];
            if (value !== password) {
                errorMsg.textContent = rule.errorMessages?.matchWith || '';
                actualInput?.setAttribute('aria-invalid', 'true');
                isValid = false;
                continue;
            }
        }
    }

    return isValid;
}
