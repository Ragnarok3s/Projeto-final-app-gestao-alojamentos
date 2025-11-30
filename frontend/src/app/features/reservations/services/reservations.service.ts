import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { CreateReservationPayload, Reservation } from '../models/reservation.model';

type ApiReservation = Reservation & { checkIn?: string; checkOut?: string };

@Injectable({ providedIn: 'root' })
export class ReservationsService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getOverviewReservations(from: string, to: string): Observable<Reservation[]> {
    const params = { from, to };
    return this.http
      .get<Reservation[]>(`${this.baseUrl}/calendar/overview`, { params })
      .pipe(map((reservations) => reservations.map((reservation) => this.normalizeReservation(reservation))));
  }

  getReservations(unitId: number, from?: string, to?: string): Observable<Reservation[]> {
    let params = new HttpParams();
    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http
      .get<ApiReservation[]>(`${this.baseUrl}/units/${unitId}/reservations`, { params })
      .pipe(map((reservations) => reservations.map((reservation) => this.normalizeReservation(reservation))));
  }

  updateReservation(id: number, payload: Partial<Reservation>): Observable<Reservation> {
    return this.http
      .put<ApiReservation>(`${this.baseUrl}/reservations/${id}`, payload)
      .pipe(map((reservation) => this.normalizeReservation(reservation)));
  }

  cancelReservation(id: number): Observable<Reservation> {
    return this.http
      .patch<ApiReservation>(`${this.baseUrl}/reservations/${id}/cancel`, {})
      .pipe(map((reservation) => this.normalizeReservation(reservation)));
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

    return this.http
      .post<ApiReservation>(`${this.baseUrl}/units/${unitId}/reservations`, body)
      .pipe(map((reservation) => this.normalizeReservation(reservation)));
  }

  private normalizeReservation(reservation: ApiReservation): Reservation {
    const { checkIn, checkOut, ...rest } = reservation;

    const startDate = reservation.startDate ?? checkIn;
    const endDate = reservation.endDate ?? checkOut;

    return {
      ...rest,
      startDate: startDate ?? '',
      endDate: endDate ?? ''
    };
  }
}
