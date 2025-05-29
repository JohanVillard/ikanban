import { checkSchema } from 'express-validator';

const updateUserValidationSchema = checkSchema({
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

export default updateUserValidationSchema;
