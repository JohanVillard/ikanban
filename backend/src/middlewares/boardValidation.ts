import { checkSchema } from 'express-validator';

const boardValidationSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le nom est requis',
        },
    },
});

export default boardValidationSchema;
