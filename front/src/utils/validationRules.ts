import { ValidationRule } from '../types/validation';

export const validationRules: ValidationRule[] = [
    {
        label: 'name',
        notEmpty: true,
        minLength: 2,
        errorMessages: {
            notEmpty: 'Le nom est requis',
            minLength: 'Le nom doit contenir au moins 2 caractères',
        },
    },
    {
        label: 'email',
        notEmpty: true,
        pattern: '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$',
        errorMessages: {
            notEmpty: "L'email est requis",
            pattern: 'Veuillez entrer une adresse email valide',
        },
    },
    {
        label: 'password',
        notEmpty: true,
        minLength: 8,
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        },
        errorMessages: {
            notEmpty: 'Le mot de passe est requis',
            minLength: 'Le mot de passe doit contenir au moins 8 caractères',
            isStrongPassword:
                'Le mot de passe doit contenir au moins un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial',
        },
    },
    {
        label: 'passconf',
        notEmpty: true,
        matchWith: 'password',
        errorMessages: {
            notEmpty: 'La confirmation du mot de passe est requise',
            matchWith: 'Les mots de passe ne correspondent pas',
        },
    },
    { label: 'description', notEmpty: false },
    {
        label: 'wip',
        pattern: '^([1-9]\\d*)?$', // Accepte les entiers et les chaînes vides
        errorMessages: {
            pattern: 'Veuillez entrer uniquement des chiffres positifs',
        },
    },
];

export const inputLabels = [
    'name',
    'email',
    'password',
    'passconf',
    'description',
    'wip',
];
