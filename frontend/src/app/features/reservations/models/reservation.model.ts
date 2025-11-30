export interface Reservation {
  id: number;
  unitId: number;
  startDate: string;
  endDate: string;
  guestName: string;
  guestContact?: string;
  notes?: string;
  status: 'CONFIRMED' | 'CANCELLED';
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
