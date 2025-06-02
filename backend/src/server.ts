import app from './app.js';
import config from './config/config.js';
import connectDB from './config/postgres-config.js';

async function startServer() {
    await connectDB();

    app.listen(config.server.port, () => {
        console.log(
            `Serveur en cours d'exécution sur le port ${config.server.port}`
        );
        console.log(
            `Accédez à la documentation Swagger via http://localhost:${config.server.port}/api-docs`
        );
    });
}

startServer();
