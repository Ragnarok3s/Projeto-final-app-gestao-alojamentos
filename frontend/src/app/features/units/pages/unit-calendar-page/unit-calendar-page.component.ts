import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { DayPilot } from '@daypilot/daypilot-lite-angular';
import { Observable, Subscription, map, of } from 'rxjs';
import { DayPilot } from '@daypilot/daypilot-lite-angular';

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
  currentDate: Date = new Date();
  currentView: DayPilot.CalendarViewType = 'Month';

  reservations$: Observable<Reservation[]> = of([]);
  calendarEvents$: Observable<DayPilot.EventData[]> = of([]);
  loading$: Observable<boolean> = this.store.select(selectReservationsLoading);
  error$: Observable<string | null> = this.store.select(selectReservationsError);

  selectedReservation: Reservation | null = null;
  private reservationsSub?: Subscription;
  private currentReservations: Reservation[] = [];

  monthConfig: DayPilot.MonthConfig = {
    start: DayPilot.Date.today().firstDayOfMonth(),
    eventClick: (args) => this.handleEventClick(args),
    headerDateFormat: 'MMMM yyyy',
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
      const { from, to } = this.updateVisibleRange(this.monthConfig.start);
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

  handleEventClick(event: DayPilot.MonthEventClickArgs): void {
    const reservationId = Number(event.e.id());
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

  changeMonth(offset: number): void {
    const newStart = this.monthConfig.start.addMonths(offset);
    this.monthConfig = { ...this.monthConfig, start: newStart };
    this.updateVisibleRange(newStart);
  }

  private updateVisibleRange(start: DayPilot.Date): { from: string; to: string } {
    const firstDay = start.firstDayOfMonth();
    const lastDay = firstDay.addMonths(1).addDays(-1);

    this.from = firstDay.toString('yyyy-MM-dd');
    this.to = lastDay.toString('yyyy-MM-dd');

    if (this.unitId) {
      this.store.dispatch(loadReservations({ unitId: this.unitId, from: this.from, to: this.to }));
    }

    return { from: this.from, to: this.to };
  }

  private mapReservationsToEvents(reservations: Reservation[]): DayPilot.EventData[] {
    return reservations.map((reservation) => ({
      id: reservation.id.toString(),
      text: reservation.guestName,
      start: reservation.startDate,
      end: reservation.endDate,
      allDay: true,
      cssClass: reservation.status === 'CONFIRMED' ? 'reservation-confirmed' : 'reservation-cancelled'
    }));
  }

  private getMonthStart(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = (day + 6) % 7; // start week on Monday
    weekStart.setDate(weekStart.getDate() - diff);
    return weekStart;
  }

  private toIsoDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
