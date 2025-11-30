import { Request, Response, NextFunction } from 'express';
import { listUnits, createUnit, updateUnit, deleteUnit as deleteUnitService } from '../services/units.service';
import { HttpError } from '../utils/httpError';

export async function getUnits(_req: Request, res: Response, next: NextFunction) {
  try {
    const units = await listUnits();
    return res.json(units);
  } catch (error) {
    return next(error);
  }
}

export async function postUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const { name, isActive, capacity } = req.body;
    const unit = await createUnit({ name, isActive, capacity });
    return res.status(201).json(unit);
  } catch (error) {
    return next(error);
  }
}

export async function putUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, isActive, capacity } = req.body;
    const unitId = Number(id);
    if (Number.isNaN(unitId)) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const unit = await updateUnit(unitId, { name, isActive, capacity });
    return res.json(unit);
  } catch (error) {
    return next(error);
  }
}

export async function deleteUnit(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const unitId = Number(id);

    if (Number.isNaN(unitId)) {
      throw new HttpError(400, 'ID inválido');
    }

    const unit = await deleteUnitService(unitId);
    return res.status(200).json(unit);
  } catch (error) {
    return next(error);
  }
}
