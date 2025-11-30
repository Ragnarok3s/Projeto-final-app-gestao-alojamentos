import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getOverviewReservations } from '../controllers/reservations.controller';

const router = Router();

router.use(authMiddleware);
router.get('/overview', getOverviewReservations);

export { router as calendarRouter };
