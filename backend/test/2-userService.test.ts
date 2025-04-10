import { expect } from "chai";
import UserService from "../src/services/userService.js";
import { compareSync } from "bcrypt-ts";

const userData = {
	name: "tester1",
	email: "mail.example.com",
	plainPassword: "testPassword"
}

describe('Test de la classe UserService', () => {
	it('doit créer et supprimer un utilisateur', async () => {
		const userService = new UserService();
		const user = await userService.createUser(userData.name, userData.email, userData.plainPassword);

		// Vérifier si l'ID est une UUID valide
		expect(user).to.have.property('id');
		expect(user.id).to.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);

		expect(user).to.deep.include({
			name: userData.name,
			email: userData.email,
		});

		// Vérifier si l'utilisateur a été supprimé
		if (user.id) {
			const isUserDeleted = await userService.deleteUser(user.id);

			expect(isUserDeleted).to.be.true;

			// Vérifier que l'utilisateur n'est plus dans la base de données
			try {
				await userService.getUserById(user.id);
			} catch (error) {
				const err = error as Error;
				expect(err.message).to.equal("Impossible de récupérer l'utilisateur.");
			}
		} else {
			throw new Error("ID de l'utilisateur manquant lors du test de suppression.");
		}
	});

	it('doit vérifier que le mots de passe hashé correspond', async () => {
		const userService = new UserService()
		const user = await userService.createUser(userData.name, userData.email, userData.plainPassword);

		const isValid = await userService.verifyPassword(user.email!, userData.plainPassword)

		expect(isValid).to.be.true;

		// Vérification pour voir si le mot de passe est en clair dans la BDD
		expect(user.passwordHash).to.not.equal(userData.plainPassword);

		await userService.deleteUser(user.id!);
	});

	//it('doit vérifier si le mail est déjà enregistré', async () => { });

	//it('doit vérifier le format du mail', async () => { });
})
