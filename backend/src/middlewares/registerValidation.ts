import { checkSchema } from 'express-validator';

const registerValidationSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le nom est requis',
        },
        isLength: {
            options: { min: 2 },
            errorMessage: 'Le nom doit contenir au moins 2 caractères',
        },
    },
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le mot de passe est requis',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères',
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            },
            errorMessage:
                'Le mot de passe doit contenir au moins un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial',
        },
    },
    passconf: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le mot de passe est requis',
        },
        isLength: {
            options: { min: 8 },
            errorMessage: 'Le mot de passe doit contenir au moins 8 caractères',
        },
        isStrongPassword: {
            options: {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            },
            errorMessage:
                'Le mot de passe doit contenir au moins un chiffre, une lettre majuscule, une lettre minuscule et un caractère spécial',
        },
    },
    email: {
        in: ['body'],
        notEmpty: {
            errorMessage: "L'email est requis",
        },
        isEmail: {
            errorMessage: "L'email doit être valide",
        },
    },
});

export default registerValidationSchema;
