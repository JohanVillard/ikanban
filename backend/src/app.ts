import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';
import authRoutes from '../src/api/v1/routes/auth';
import userRoutes from '../src/api/v1/routes/userRoutes';
import boardRoutes from '../src/api/v1/routes/boardRoutes';
import columnRoutes from '../src/api/v1/routes/columnRoutes';
import taskRoutes from '../src/api/v1/routes/taskRoutes';

const app = express();

app.use(cookieParser());

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

app.use(express.json());

app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api/v1', authRoutes);
app.use('/api/v1', userRoutes);
app.use('/api/v1', boardRoutes);
app.use('/api/v1', columnRoutes);
app.use('/api/v1', taskRoutes);

export default app;
