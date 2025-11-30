import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth';
import { getUnits, postUnit, putUnit, deleteUnit } from '../controllers/units.controller';

const router = Router();

router.use(authMiddleware);
router.get('/', getUnits);
router.post('/', postUnit);
router.put('/:id', putUnit);
router.delete('/:id', deleteUnit);

export { router as unitsRouter };
