import express from 'express';
import cors from 'cors';
import { authRouter } from './routes/auth.routes';
import { unitsRouter } from './routes/units.routes';
import { reservationsRouter } from './routes/reservations.routes';
import { getOverviewReservations } from './controllers/reservations.controller';
import { authMiddleware } from './middlewares/auth';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, _res, next) => {
  // Logging simples de requests
  // eslint-disable-next-line no-console
  console.log(`${req.method} ${req.path}`);
  next();
});

const apiRouter = express.Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/units', unitsRouter);
apiRouter.get('/calendar/overview', authMiddleware, getOverviewReservations);
apiRouter.use(reservationsRouter);

app.use('/api', apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

app.use(errorHandler);

export { app };
