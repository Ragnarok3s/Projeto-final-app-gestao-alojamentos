import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import {
  getReservations,
  postReservation,
  putReservation,
  cancelReservationHandler,
} from '../controllers/reservations.controller';

const router = Router();

router.use(authMiddleware);
router.get('/units/:unitId/reservations', getReservations);
router.post('/units/:unitId/reservations', postReservation);
router.put('/reservations/:id', putReservation);
router.patch('/reservations/:id/cancel', cancelReservationHandler);

export { router as reservationsRouter };
