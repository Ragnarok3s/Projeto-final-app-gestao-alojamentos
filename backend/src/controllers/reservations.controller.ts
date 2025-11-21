import { Request, Response, NextFunction } from 'express';
import {
  listReservations,
  createReservation,
  updateReservation,
  cancelReservation,
} from '../services/reservations.service';

interface ReservationRecord {
  id: number;
  unitId: number;
  startDate: Date;
  endDate: Date;
  guestName: string;
  guestContact: string | null;
  notes: string | null;
  status: string;
  createdAt: Date;
}

function toApiReservation(reservation: ReservationRecord) {
  const { startDate, endDate, ...rest } = reservation;
  return { ...rest, checkIn: startDate, checkOut: endDate };
}

export async function getReservations(req: Request, res: Response, next: NextFunction) {
  try {
    const unitId = Number(req.params.unitId);
    if (Number.isNaN(unitId)) {
      return res.status(400).json({ message: 'ID da unidade inválido' });
    }

    const { from, to } = req.query as { from?: string; to?: string };
    const reservations = await listReservations(unitId, from, to);
    return res.json(reservations.map(toApiReservation));
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

    const { checkIn, checkOut, startDate, endDate, guestName, guestContact, notes } = req.body;

    const arrivalDate = checkIn ?? startDate;
    const departureDate = checkOut ?? endDate;

    if (!arrivalDate || !departureDate || !guestName) {
      return res
        .status(400)
        .json({ message: 'checkIn, checkOut e guestName são obrigatórios' });
    }

    const reservation = await createReservation(unitId, {
      checkIn: arrivalDate,
      checkOut: departureDate,
      guestName,
      guestContact,
      notes,
    });
    return res.status(201).json(toApiReservation(reservation));
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

    const { checkIn, checkOut, startDate, endDate, guestName, guestContact, notes } = req.body;

    const arrivalDate = checkIn ?? startDate;
    const departureDate = checkOut ?? endDate;

    if (!arrivalDate || !departureDate || !guestName) {
      return res
        .status(400)
        .json({ message: 'checkIn, checkOut e guestName são obrigatórios' });
    }

    const reservation = await updateReservation(reservationId, {
      checkIn: arrivalDate,
      checkOut: departureDate,
      guestName,
      guestContact,
      notes,
    });
    return res.json(toApiReservation(reservation));
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
    return res.json(toApiReservation(reservation));
  } catch (error) {
    return next(error);
  }
}
