import { checkSchema } from 'express-validator';

const authValidationSchema = checkSchema({
    password: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le mot de passe est requis',
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

export default authValidationSchema;
