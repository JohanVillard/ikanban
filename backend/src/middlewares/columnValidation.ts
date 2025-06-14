import { checkSchema } from 'express-validator';

const columnValidationSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le nom est requis',
        },
    },
    wip: {
        in: ['body'],
        optional: { options: { checkFalsy: true } }, // Laisse passer les valeurs falsy
        isInt: {
            options: { min: 1 },
            errorMessage: 'Veuillez entrer uniquement des chiffres positifs',
        },
        toInt: true,
    },
});

export default columnValidationSchema;
