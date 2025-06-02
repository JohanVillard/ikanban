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

// Je sécurise les headers HTTP
app.use(helmet());

app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

// J'améliore les logs
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Je déclare les routes
app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', boardRoutes);
app.use('/api/v1', columnRoutes);
app.use('/api/v1', taskRoutes);

export default app;
