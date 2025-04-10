import app from './app';
import config from './config/config';
import connectDB from './config/postgres-config';

async function startServer() {
	await connectDB();

	app.listen(config.server.port, () => {
		console.log(
			`Serveur en cours d'exécution sur le port ${config.server.port}`,
		);
		console.log(
			`Accédez à la documentation Swagger via http://localhost:${config.server.port}/api-docs`,
		);
	});
}

startServer();
