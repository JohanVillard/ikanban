import { checkSchema } from 'express-validator';

const columnValidationSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le nom est requis',
        },
    },
});

export default columnValidationSchema;
