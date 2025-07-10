import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger.js';
import authRoutes from './api/v1/routes/auth.js';
import userRoutes from './api/v1/routes/userRoutes.js';
import boardRoutes from './api/v1/routes/boardRoutes.js';
import columnRoutes from './api/v1/routes/columnRoutes.js';
import taskRoutes from './api/v1/routes/taskRoutes.js';

const app = express();

app.use(helmet()); // Je sécurise les headers HTTP
app.use(cookieParser()); // Middleware de gestion de cookies
// TODO: À configurer pour la prod
// Accepte les requêtes de Vite et autorise les cookies..
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); // Intérprétation des requêtes JSON
app.use(morgan('dev')); // Améliorations des log
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Déclaration des routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', boardRoutes);
app.use('/api/v1', columnRoutes);
app.use('/api/v1', taskRoutes);

export default app;
