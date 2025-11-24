import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, Subscription, map, of } from 'rxjs';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';

import { Reservation } from '../../../reservations/models/reservation.model';
import { cancelReservation, loadReservations, updateReservation } from '../../../reservations/state/reservations.actions';
import {
  selectReservationsByUnit,
  selectReservationsError,
  selectReservationsLoading
} from '../../../reservations/state/reservations.selectors';

@Component({
  selector: 'app-unit-calendar-page',
  standalone: false,
  templateUrl: './unit-calendar-page.component.html',
  styleUrls: ['./unit-calendar-page.component.scss']
})
export class UnitCalendarPageComponent implements OnInit, OnDestroy {
  unitId!: number;
  from!: string;
  to!: string;

  reservations$: Observable<Reservation[]> = of([]);
  calendarEvents$: Observable<EventInput[]> = of([]);
  loading$: Observable<boolean> = this.store.select(selectReservationsLoading);
  error$: Observable<string | null> = this.store.select(selectReservationsError);

  selectedReservation: Reservation | null = null;
  private reservationsSub?: Subscription;
  private currentReservations: Reservation[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },
    eventClick: this.handleEventClick.bind(this),
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin]
  };

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly store: Store) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (isNaN(id)) {
        return;
      }

      this.unitId = id;
      const { from, to } = this.getCurrentMonthRange();
      this.from = from;
      this.to = to;

      this.store.dispatch(loadReservations({ unitId: this.unitId, from, to }));
      this.reservations$ = this.store.select(selectReservationsByUnit(this.unitId));
      this.calendarEvents$ = this.reservations$.pipe(map((reservations) => this.mapReservationsToEvents(reservations)));

      this.reservationsSub?.unsubscribe();
      this.reservationsSub = this.reservations$.subscribe((reservations) => (this.currentReservations = reservations));
    });
  }

  ngOnDestroy(): void {
    this.reservationsSub?.unsubscribe();
  }

  goBack(): void {
    this.router.navigate(['/app/units']);
  }

  refresh(): void {
    if (this.unitId) {
      this.store.dispatch(loadReservations({ unitId: this.unitId, from: this.from, to: this.to }));
    }
  }

  handleEventClick(event: EventClickArg): void {
    const reservationId = Number(event.event.id);
    const reservation = this.currentReservations.find((r) => r.id === reservationId);
    if (reservation) {
      this.selectedReservation = reservation;
    }
  }

  closeDialog(): void {
    this.selectedReservation = null;
  }

  updateSelectedReservation(changes: Partial<Reservation>): void {
    if (!this.selectedReservation) {
      return;
    }

    this.store.dispatch(updateReservation({ id: this.selectedReservation.id, changes }));
  }

  cancelSelectedReservation(): void {
    if (!this.selectedReservation) {
      return;
    }

    this.store.dispatch(cancelReservation({ id: this.selectedReservation.id }));
  }

  private getCurrentMonthRange(): { from: string; to: string } {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    return {
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0]
    };
  }

  private mapReservationsToEvents(reservations: Reservation[]): EventInput[] {
    return reservations.map((reservation) => ({
      id: reservation.id.toString(),
      title: reservation.guestName,
      start: reservation.startDate,
      end: reservation.endDate,
      allDay: true,
      classNames: [
        'reservation-event',
        reservation.status === 'CONFIRMED' ? 'reservation-confirmed' : 'reservation-cancelled'
      ]
    }));
  }
}
