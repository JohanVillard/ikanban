import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerDocs from './config/swagger';
import userRoutes from './routes/userRoutes';

const app = express();

app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', userRoutes);

export default app;
