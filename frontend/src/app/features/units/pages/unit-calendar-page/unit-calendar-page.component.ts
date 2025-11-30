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
  currentDate: Date = new Date();
  currentView: DayPilot.CalendarViewType = 'Week';

  reservations$: Observable<Reservation[]> = of([]);
  events: DayPilot.EventData[] = [];
  loading$: Observable<boolean> = this.store.select(selectReservationsLoading);
  error$: Observable<string | null> = this.store.select(selectReservationsError);

  selectedReservation: Reservation | null = null;
  private reservationsSub?: Subscription;
  private currentReservations: Reservation[] = [];

  config: DayPilot.CalendarConfig = {
    viewType: 'Week',
    startDate: DayPilot.Date.today().firstDayOfMonth(),
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
      const start = new DayPilot.Date(this.config.startDate);
      const { from, to } = this.updateVisibleRange(start);
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
    this.currentDate = new Date();
    this.updateCalendarRange(this.currentDate, this.currentView);
  }

  goToPrevious(): void {
    const updatedDate = new Date(this.currentDate);
    if (this.currentView === 'Month') {
      updatedDate.setDate(1);
      updatedDate.setMonth(updatedDate.getMonth() - 1);
    } else {
      updatedDate.setDate(updatedDate.getDate() - 7);
    }

    this.updateCalendarRange(updatedDate, this.currentView);
  }

  goToNext(): void {
    const updatedDate = new Date(this.currentDate);
    if (this.currentView === 'Month') {
      updatedDate.setDate(1);
      updatedDate.setMonth(updatedDate.getMonth() + 1);
    } else {
      updatedDate.setDate(updatedDate.getDate() + 7);
    }

    this.updateCalendarRange(updatedDate, this.currentView);
  }

  setView(view: DayPilot.CalendarViewType): void {
    if (this.currentView === view) {
      return;
    }

    this.currentView = view;
    this.updateCalendarRange(this.currentDate, this.currentView);
  }

  onEventClick(event: DayPilot.EventClickArgs): void {
    const reservationId = Number(event.e.id());
    const reservation = this.currentReservations.find((r) => r.id === reservationId);
    if (reservation) {
      this.selectedReservation = reservation;
    }
  }

  onTimeRangeSelected(args: DayPilot.TimeRangeSelectedArgs): void {
    const startDate = args.start.toDate();
    this.currentView = 'Week';
    this.updateCalendarRange(startDate, 'Week');
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

  changeMonth(offset: number): void {
    const startDate = new DayPilot.Date(this.config.startDate || DayPilot.Date.today());
    const newStart = startDate.addMonths(offset);
    this.config = { ...this.config, startDate: newStart };
    this.updateVisibleRange(newStart);
  }

  private updateCalendarRange(date: Date, view: DayPilot.CalendarViewType): void {
    const start = view === 'Month' ? new DayPilot.Date(this.getMonthStart(date)) : new DayPilot.Date(this.getWeekStart(date));

    this.currentDate = date;
    this.currentView = view;
    this.config = { ...this.config, viewType: view, startDate: start };
    this.updateVisibleRange(start);
  }

  private updateVisibleRange(start: DayPilot.Date): { from: string; to: string } {
    const viewType = this.config.viewType || 'Month';
    const firstDay =
      viewType === 'Week' ? new DayPilot.Date(this.getWeekStart(start.toDate())) : start.firstDayOfMonth();
    const lastDay = viewType === 'Week' ? firstDay.addDays(6) : firstDay.addMonths(1).addDays(-1);

    this.from = firstDay.toString('yyyy-MM-dd');
    this.to = lastDay.toString('yyyy-MM-dd');

    if (this.unitId) {
      this.store.dispatch(loadReservations({ unitId: this.unitId, from: this.from, to: this.to }));
    }

    return { from: this.from, to: this.to };
  }

  private mapReservationsToEvents(reservations: Reservation[]): DayPilot.EventData[] {
    return reservations.map((reservation) => ({
      id: reservation.id,
      text: reservation.guestName || 'Reserva',
      start: reservation.startDate,
      end: reservation.endDate
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
}
