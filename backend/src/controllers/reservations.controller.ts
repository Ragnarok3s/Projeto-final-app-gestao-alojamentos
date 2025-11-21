import { Request, Response, NextFunction } from 'express';
import {
  listReservations,
  createReservation,
  updateReservation,
  cancelReservation,
} from '../services/reservations.service';

export async function getReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const unitId = Number(req.params.unitId);
    if (Number.isNaN(unitId)) {
      return res.status(400).json({ message: 'ID da unidade inválido' });
    }

    const { from, to } = req.query as { from?: string; to?: string };
    const reservations = await listReservations(unitId, from, to);
    return res.json(reservations);
  } catch (error) {
    return next(error);
  }
}

export async function postReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const unitId = Number(req.params.unitId);
    if (Number.isNaN(unitId)) {
      return res.status(400).json({ message: 'ID da unidade inválido' });
    }

    const { startDate, endDate, guestName, guestContact, notes } = req.body;

    if (!startDate || !endDate || !guestName) {
      return res.status(400).json({ message: 'startDate, endDate e guestName são obrigatórios' });
    }

    const reservation = await createReservation(unitId, {
      startDate,
      endDate,
      guestName,
      guestContact,
      notes,
    });
    return res.status(201).json(reservation);
  } catch (error) {
    return next(error);
  }
}

export async function putReservation(req: Request, res: Response, next: NextFunction) {
  try {
    const reservationId = Number(req.params.id);
    if (Number.isNaN(reservationId)) {
      return res.status(400).json({ message: 'ID de reserva inválido' });
    }

    const { startDate, endDate, guestName, guestContact, notes } = req.body;

    if (!startDate || !endDate || !guestName) {
      return res.status(400).json({ message: 'startDate, endDate e guestName são obrigatórios' });
    }

    const reservation = await updateReservation(reservationId, {
      startDate,
      endDate,
      guestName,
      guestContact,
      notes,
    });
    return res.json(reservation);
  } catch (error) {
    return next(error);
  }
}

export async function cancelReservationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const reservationId = Number(req.params.id);
    if (Number.isNaN(reservationId)) {
      return res.status(400).json({ message: 'ID de reserva inválido' });
    }

    const reservation = await cancelReservation(reservationId);
    return res.json(reservation);
  } catch (error) {
    return next(error);
  }
}
