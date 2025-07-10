import { expect } from 'chai';
import sinon from 'sinon';
import UserService from '../src/api/v1/services/userService';
import UserDb from '../src/api/v1/repositories/userDb';
import chaiAsPromised from 'chai-as-promised';
import * as chai from 'chai';
import { NewUser, UserDbRecord } from '../src/types/user';

chai.use(chaiAsPromised);

class UserServiceTestable extends UserService {
    public testValidatePasswordsMatch(
        password: string,
        passconf: string
    ): void {
        return this.validatePasswordsMatch(password, passconf);
    }

    public testHashPassword(saltRounds: number, plainPassword: string): string {
        return this.hashPassword(saltRounds, plainPassword);
    }
}

describe('UserService', () => {
    let userService: UserServiceTestable;

    // Simulation de la classe UserDb
    let userDbStub: sinon.SinonStubbedInstance<UserDb>;

    // Avant chaque test
    beforeEach(() => {
        userService = new UserServiceTestable();
        // Création d'une fausse instance de UserDb
        userDbStub = sinon.createStubInstance(UserDb);
        userService['userDb'] = userDbStub;
    });

    afterEach(() => {
        sinon.restore();
    });

    it('doit créer un utilisateur avec succès et le retourner sans le mot de passe haché', async () => {
        // 1. Déclaration des données nécéssaires pour créer un nouvel utilisateur
        const newUser: NewUser = {
            name: 'John Doe',
            email: 'john@example.com',
            password: 'Password123!',
            passconf: 'Password123!',
        };

        // 2. Déclaration des données nécéssaires pour insérer le nouvel utilisateur dans la DB
        const fakeUser: UserDbRecord = {
            id: '1',
            name: newUser.email,
            email: newUser.email,
            password_hash: 'hashed_password_123',
        };

        userDbStub.findByMail.resolves(null); // Simule email est unique
        userDbStub.create.resolves(fakeUser); // Simule l'appel à la db

        const result = await userService.createUser(newUser);

        // Je vérifie que les méthodes simulées ont bien été appelées
        expect(userDbStub.create.calledOnce).to.be.true;
        expect(userDbStub.findByMail.calledWith(newUser.email)).to.be.true;
        expect(result).to.deep.equal({
            id: fakeUser.id,
            name: fakeUser.name,
            email: fakeUser.email,
        });
    });

    it('doit supprimer un utilisateur avec succès', async () => {
        const fakeUserId = '1';

        // La méthode retourne true
        userDbStub.delete.resolves(true);

        const result = await userService.deleteUser(fakeUserId);

        expect(result).to.be.true;
        expect(userDbStub.delete.calledOnceWith(fakeUserId)).to.be.true;
    });

    describe('validatePasswordMatch', () => {
        it("ne doit pas lancer d'erreur si les mots de passe correspondent", () => {
            expect(() =>
                userService.testValidatePasswordsMatch('Azerty1!', 'Azerty1!')
            ).to.not.throw();
        });

        it('doit renvoyer une erreur si les mots de passe ne correspondent pas', () => {
            expect(() =>
                userService.testValidatePasswordsMatch('Azerty1!', 'ytreza')
            ).to.throw(
                'Le mot de passe et sa confirmation ne correspondent pas'
            );
        });
    });

    describe('hashPassword', () => {
        it('doit retourner une chaîne non vide différente du mot de passe', () => {
            const plainPassword = 'Azerty1!';
            const saltRounds = 10;
            const hashed = userService.testHashPassword(
                saltRounds,
                plainPassword
            );

            expect(hashed).to.be.a('string').and.not.empty;
            expect(hashed).to.not.equal(plainPassword);
        });

        it('doit produire des hashes différents pour le même mot de passe', () => {
            const plainPassword = 'Azerty1!';
            const saltRounds = 10;

            const hash1 = userService.testHashPassword(
                saltRounds,
                plainPassword
            );
            const hash2 = userService.testHashPassword(
                saltRounds,
                plainPassword
            );

            expect(hash1).to.not.equal(hash2);
        });
    });

    describe('verifyCredentials', () => {
        let userService: UserService;
        let userDbStub: sinon.SinonStubbedInstance<UserDb>;

        beforeEach(() => {
            userDbStub = sinon.createStubInstance(UserDb);
            userService = new UserService();
            // @ts-ignore accès direct pour injection manuelle du stub
            userService['userDb'] = userDbStub;
        });

        it("doit rejeter si l'email est vide", async () => {
            await expect(
                userService.verifyCredentials('', 'Azerty1!')
            ).to.be.rejectedWith('Email ou mot de passe requis');
        });

        it("doit rejeter si l'utilisateur n'existe pas", async () => {
            userDbStub.findByMail.resolves(null);

            await expect(
                userService.verifyCredentials('john@example.com', 'pass123')
            ).to.be.rejectedWith('Les identifiants sont invalides');
        });

        it('doit rejeter si le mot de passe est incorrect', async () => {
            userDbStub.findByMail.resolves({
                id: '1',
                name: 'John',
                email: 'john@example.com',
                password_hash:
                    '$2b$10$123456789012345678901uIrZTpkUCxNi9/5kxz38yaeI9lQ6JLzi', // faux hash
            });

            await expect(
                userService.verifyCredentials('john@example.com', 'wrongpass')
            ).to.be.rejectedWith('Les identifiants sont invalides');
        });

        it("doit retourner l'utilisateur si l'authentification est réussi", async () => {});
    });
});
