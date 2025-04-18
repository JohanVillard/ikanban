import { expect } from 'chai';
import { Request, Response } from 'express';
import sinon from 'sinon';
import UserController from '../src/api/v1/controllers/userController';
import UserService from '../src/api/v1/services/userService';

// Simulation du service
describe('UserController', () => {
    let userController: UserController;
    let userServiceStub: sinon.SinonStubbedInstance<UserService>;

    beforeEach(() => {
        // Créer une instance du contrôleur
        userServiceStub = sinon.createStubInstance(UserService);
        userController = new UserController();
        userController['userService'] = userServiceStub;
    });

    describe('createUser', () => {
        it('doit créer un utilisateur avec succès', async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                },
            } as Request;

            const res = {
                status: sinon.stub().returnsThis(), // Permet de chaîner les appels
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            // Simuler une réponse réussie de createUser sur le stub
            userServiceStub.createUser.resolves({
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
            });

            // Appeler la méthode du contrôleur
            await userController.registerUser(req, res);

            // Vérifier que status a été appelé avec 201 et json avec les bonnes données
            expect(res.status.calledWith(201)).to.be.true;
            expect(
                res.json.calledWith({
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                })
            ).to.be.true;
        });

        it("doit renvoyer une erreur si l'utilisateur existe déjà", async () => {
            // Configurer le stub pour générer l'erreur
            const tableExistsError = new Error(
                'Impossible de créer le compte.'
            );
            userServiceStub.createUser.rejects(tableExistsError);

            // Préparer la requête
            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                },
            } as Request;
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            await userController.registerUser(req, res);

            expect(res.status.calledWith(409)).to.be.true;
            expect(
                res.json.calledWith({ error: 'Impossible de créer le compte.' })
            ).to.be.true;
        });

        it("doit renvoyer une erreur 500 en cas d'erreur du serveur", async () => {
            const req = {
                body: {
                    name: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                },
            } as Request;
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            userServiceStub.createUser.rejects(
                new Error('Erreur serveur inconnue.')
            );

            await userController.registerUser(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({ error: 'Erreur serveur inconnue.' }))
                .to.be.true;
        });
    });

    describe('fetchUserById', () => {
        it("doit récupérer l'utilisateur par son ID", async () => {
            const req = {
                params: {
                    userId: '1',
                },
            } as unknown as Request;
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            userServiceStub.getUserById.resolves({
                id: '1',
                name: 'John Doe',
                email: 'john@example.com',
            });

            await userController.fetchUserById(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(
                res.json.calledWith({
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                })
            ).to.be.true;
        });

        it("doit retourner 404 si l'utilisateur n'est pas trouvé", async () => {
            const req = {
                params: {
                    userId: 'non-existent-id',
                },
            } as unknown as Request;
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            userServiceStub.getUserById.resolves(undefined);

            await userController.fetchUserById(req, res);

            expect(res.sendStatus.calledWith(404)).to.be.true;
        });

        it('should return 500 on server error', async () => {
            const req = {
                params: {
                    userId: '1',
                },
            } as unknown as Request;
            const res = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub(),
                sendStatus: sinon.stub(),
            } as unknown as Response & {
                status: sinon.SinonStub;
                json: sinon.SinonStub;
                sendStatus: sinon.SinonStub;
            };

            userServiceStub.getUserById.rejects(
                new Error('Erreur serveur inconnue.')
            );

            await userController.fetchUserById(req, res);

            expect(res.sendStatus.calledWith(500)).to.be.true;
        });
    });
});
