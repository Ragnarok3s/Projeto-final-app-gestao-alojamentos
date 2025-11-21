import { prisma } from '../config/prisma';
import { HttpError } from '../utils/httpError';

interface ReservationInput {
  startDate: string;
  endDate: string;
  guestName: string;
  guestContact?: string;
  notes?: string;
}

function parseDate(input: string, field: string): Date {
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) {
    throw new HttpError(400, `Data inválida em ${field}`);
  }
  return date;
}

function getDefaultDateRange() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
  return { start, end };
}

async function ensureUnitExists(unitId: number) {
  const unit = await prisma.unit.findUnique({ where: { id: unitId } });
  if (!unit) {
    throw new HttpError(404, 'Unidade não encontrada');
  }
}

async function checkDateConflicts(unitId: number, start: Date, end: Date, excludeId?: number) {
  const conflict = await prisma.reservation.findFirst({
    where: {
      unitId,
      status: 'CONFIRMED',
      id: excludeId ? { not: excludeId } : undefined,
      startDate: { lt: end },
      endDate: { gt: start },
    },
  });

  if (conflict) {
    throw new HttpError(409, 'Já existe uma reserva confirmada que colide com as datas fornecidas');
  }
}

export async function listReservations(unitId: number, from?: string, to?: string) {
  await ensureUnitExists(unitId);

  let start: Date;
  let end: Date;

  if (from && to) {
    start = parseDate(from, 'from');
    end = parseDate(to, 'to');
  } else {
    const defaults = getDefaultDateRange();
    start = defaults.start;
    end = defaults.end;
  }

  return prisma.reservation.findMany({
    where: {
      unitId,
      startDate: { lt: end },
      endDate: { gt: start },
    },
    orderBy: { startDate: 'asc' },
  });
}

export async function createReservation(unitId: number, payload: ReservationInput) {
  await ensureUnitExists(unitId);

  const startDate = parseDate(payload.startDate, 'startDate');
  const endDate = parseDate(payload.endDate, 'endDate');

  if (startDate >= endDate) {
    throw new HttpError(400, 'Data de início deve ser anterior à data de fim');
  }

  await checkDateConflicts(unitId, startDate, endDate);

  return prisma.reservation.create({
    data: {
      unitId,
      startDate,
      endDate,
      guestName: payload.guestName,
      guestContact: payload.guestContact,
      notes: payload.notes,
      status: 'CONFIRMED',
    },
  });
}

export async function updateReservation(reservationId: number, payload: ReservationInput) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    throw new HttpError(404, 'Reserva não encontrada');
  }

  const startDate = parseDate(payload.startDate, 'startDate');
  const endDate = parseDate(payload.endDate, 'endDate');

  if (startDate >= endDate) {
    throw new HttpError(400, 'Data de início deve ser anterior à data de fim');
  }

  await checkDateConflicts(reservation.unitId, startDate, endDate, reservationId);

  return prisma.reservation.update({
    where: { id: reservationId },
    data: {
      startDate,
      endDate,
      guestName: payload.guestName,
      guestContact: payload.guestContact,
      notes: payload.notes,
    },
  });
}

export async function cancelReservation(reservationId: number) {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });
  if (!reservation) {
    throw new HttpError(404, 'Reserva não encontrada');
  }

  if (reservation.status === 'CANCELLED') {
    return reservation;
  }

  return prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' },
  });
}
