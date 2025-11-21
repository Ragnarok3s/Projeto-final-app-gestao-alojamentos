import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getUnits, postUnit, putUnit } from '../controllers/units.controller';

const router = Router();

router.use(authMiddleware);
router.get('/', getUnits);
router.post('/', postUnit);
router.put('/:id', putUnit);

export { router as unitsRouter };
