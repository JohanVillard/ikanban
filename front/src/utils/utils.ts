import { AuthObject } from '../types/api.ts';
import { JsFormData, PasswordOptions } from '../types/validation.ts';

export function jsObjectToJSON(jsObject: JsFormData): string {
    // Conversion d'objet JS en chaîne de caractères JSON
    const formDataJsonString = JSON.stringify(jsObject);

    return formDataJsonString;
}

export function isAuthObject(obj: any): obj is AuthObject {
    return (
        typeof obj === 'object' &&
        obj !== null &&
        typeof obj.success === 'boolean' &&
        typeof obj.token === 'string' &&
        typeof obj.message === 'string' &&
        typeof obj.errors === 'object' &&
        obj.errors !== null
    );
}

export function testPassword(
    password: string,
    passwordOptions: PasswordOptions
): boolean {
    // Compter le nombre de chaque type de caractère
    // le /g compte toutes les occurrences
    const lowercaseCount = (password.match(/[a-z]/g) || []).length;
    const uppercaseCount = (password.match(/[A-Z]/g) || []).length;
    const numbersCount = (password.match(/[0-9]/g) || []).length;
    const symbolsCount = (password.match(/[^a-zA-Z0-9]/g) || []).length;

    // Je vérifie si touts les prérequis sont remplis
    return (
        password.length >= passwordOptions.minLength &&
        lowercaseCount >= passwordOptions.minLowercase &&
        uppercaseCount >= passwordOptions.minUppercase &&
        numbersCount >= passwordOptions.minNumbers &&
        symbolsCount >= passwordOptions.minSymbols
    );
}
