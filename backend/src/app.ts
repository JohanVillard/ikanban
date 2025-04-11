import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';
import userRoutes from '../src/routes/userRoutes';
import boardRoutes from '../src/routes/boardRoutes'

const app = express();

app.use(cors());

app.use(express.json());

app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', userRoutes);
app.use('/api', boardRoutes);

export default app;
