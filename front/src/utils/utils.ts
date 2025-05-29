import { AuthObject } from '../types/api.ts';

export function formDataToJSON(formData: FormData): string {
    // 1. Transformation en objet JS
    const plainFormData = Object.fromEntries(formData.entries());

    // 2. Conversion d'objet JS en chaîne de caractères JSON
    const formDataJsonString = JSON.stringify(plainFormData);

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
