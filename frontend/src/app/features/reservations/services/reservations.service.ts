import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateReservationPayload, Reservation } from '../models/reservation.model';

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getReservations(unitId: number, from?: string, to?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<Reservation[]>(`${this.baseUrl}/units/${unitId}/reservations`, { params });
  }

  updateReservation(id: number, payload: Partial<Reservation>): Observable<Reservation> {
    return this.http.put<Reservation>(`${this.baseUrl}/reservations/${id}`, payload);
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.baseUrl}/reservations/${id}/cancel`, {});
  }

  createReservation(unitId: number, payload: CreateReservationPayload): Observable<Reservation> {
    const body = {
      checkIn: payload.startDate,
      checkOut: payload.endDate,
      guestName: payload.guestName,
      guestContact: payload.guestContact,
      notes: payload.notes,
      status: payload.status
    };

    return this.http.post<Reservation>(`${this.baseUrl}/units/${unitId}/reservations`, body);
  }
}
