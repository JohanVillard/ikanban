import { checkSchema } from 'express-validator';

const taskValidationSchema = checkSchema({
    name: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'Le nom est requis',
        },
    },
});

export default taskValidationSchema;
