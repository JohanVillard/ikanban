import { checkSchema } from "express-validator";

const userValidationSchema = checkSchema({
	name: {
		in: ['body'],
		isEmpty: {
			negated: true,
			errorMessage: 'Le nom est requis'
		}
	},
	password: {
		in: ['body'],
		isLength:
		{
			options:
				{ min: 8 },
			errorMessage: 'Le mot de passe doit contenir au moins 8 caractères'
		}
	},
	email: {
		in: ['body'],
		isEmail: {
			errorMessage: "L'email doit être valide"
		}
	}
}
)

export default userValidationSchema;
