import { Unit } from '../../units/models/unit.model';

export interface Reservation {
  id: number;
  unitId: number;
  unit?: Unit;
  startDate: string;
  endDate: string;
  guestName: string;
  guestContact?: string;
  notes?: string;
  status: 'CONFIRMED' | 'CANCELLED';
  guestsCount?: number;
  channel?: string;
  totalPrice?: number;
  createdAt?: string;
}

export interface CreateReservationPayload {
  unitId: number;
  startDate: string;
  endDate: string;
  guestName: string;
  guestContact?: string;
  notes?: string;
  status?: 'CONFIRMED' | 'CANCELLED';
}
