import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { Observable, Subscription, of } from 'rxjs';

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
  currentMonth: DayPilot.Date = DayPilot.Date.today();
  currentMonthLabel: string = '';

  reservations$: Observable<Reservation[]> = of([]);
  events: DayPilot.EventData[] = [];
  loading$: Observable<boolean> = this.store.select(selectReservationsLoading);
  error$: Observable<string | null> = this.store.select(selectReservationsError);

  selectedReservation: Reservation | null = null;
  private reservationsSub?: Subscription;
  private currentReservations: Reservation[] = [];

  config: DayPilot.CalendarConfig = {
    viewType: 'Days',
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    days: DayPilot.Date.today().daysInMonth(),
    headerDateFormat: 'd',
    theme: 'daypilot-light'
  };

  constructor(private readonly route: ActivatedRoute, private readonly router: Router, private readonly store: Store) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (isNaN(id)) {
        return;
      }

      this.unitId = id;
      this.currentMonth = DayPilot.Date.today();
      this.updateCalendarRange();
      this.reservations$ = this.store.select(selectReservationsByUnit(this.unitId));

      this.reservationsSub?.unsubscribe();
      this.reservationsSub = this.reservations$.subscribe((reservations) => {
        this.currentReservations = reservations;
        this.events = this.mapReservationsToEvents(reservations);
      });
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

  goToToday(): void {
    this.currentMonth = DayPilot.Date.today();
    this.updateCalendarRange();
  }

  onEventClick(event: any): void {
    const reservationId = Number(event.e.id());
    const reservation = this.currentReservations.find((r) => r.id === reservationId);
    if (reservation) {
      this.selectedReservation = reservation;
    }
  }

  onTimeRangeSelected(args: any): void {
    args.control?.clearSelection();
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

  goToPreviousMonth(): void {
    this.currentMonth = this.currentMonth.addMonths(-1);
    this.updateCalendarRange();
  }

  goToNextMonth(): void {
    this.currentMonth = this.currentMonth.addMonths(1);
    this.updateCalendarRange();
  }

  private updateCalendarRange(): void {
    this.config = {
      ...this.config,
      startDate: this.currentMonth.firstDayOfMonth(),
      days: this.currentMonth.daysInMonth()
    };

    this.currentMonthLabel = this.currentMonth.toString('MMMM yyyy');
    this.updateVisibleRange(this.currentMonth.firstDayOfMonth());
  }

  private updateVisibleRange(start: DayPilot.Date): { from: string; to: string } {
    const firstDay = start;
    const daysInView = Math.max((this.config.days || 1) - 1, 0);
    const lastDay = firstDay.addDays(daysInView);

    this.from = firstDay.toString('yyyy-MM-dd');
    this.to = lastDay.toString('yyyy-MM-dd');

    if (this.unitId) {
      this.store.dispatch(loadReservations({ unitId: this.unitId, from: this.from, to: this.to }));
    }

    return { from: this.from, to: this.to };
  }

  private mapReservationsToEvents(reservations: Reservation[]): DayPilot.EventData[] {
    return reservations
      .filter((reservation) => reservation.status !== 'CANCELLED')
      .map((reservation) => ({
        id: reservation.id,
        text: reservation.guestName || 'Reserva',
        start: reservation.startDate,
        end: reservation.endDate
      }));
  }
}
