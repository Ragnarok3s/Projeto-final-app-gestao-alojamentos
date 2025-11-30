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

type CalendarView = 'Day' | 'Days' | 'Week' | 'WorkWeek' | 'Resources';

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
  currentView: CalendarView = 'Week';

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
    updatedDate.setDate(updatedDate.getDate() - this.getNavigationOffset());

    this.updateCalendarRange(updatedDate, this.currentView);
  }

  goToNext(): void {
    const updatedDate = new Date(this.currentDate);
    updatedDate.setDate(updatedDate.getDate() + this.getNavigationOffset());

    this.updateCalendarRange(updatedDate, this.currentView);
  }

  setView(view: CalendarView): void {
    if (this.currentView === view) {
      return;
    }

    this.currentView = view;
    this.updateCalendarRange(this.currentDate, this.currentView);
  }

  onEventClick(event: any): void {
    const reservationId = Number(event.e.id());
    const reservation = this.currentReservations.find((r) => r.id === reservationId);
    if (reservation) {
      this.selectedReservation = reservation;
    }
  }

  onTimeRangeSelected(args: any): void {
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

  private updateCalendarRange(date: Date, view: CalendarView): void {
    const start =
      view === 'Week' || view === 'WorkWeek' || view === 'Resources'
        ? new DayPilot.Date(this.getWeekStart(date))
        : new DayPilot.Date(date);

    this.currentDate = date;
    this.currentView = view;
    this.config = { ...this.config, viewType: view, startDate: start };
    this.updateVisibleRange(start);
  }

  private updateVisibleRange(start: DayPilot.Date): { from: string; to: string } {
    const viewType: CalendarView = (this.config.viewType as CalendarView) || 'Week';
    const firstDay =
      viewType === 'Week' || viewType === 'WorkWeek' || viewType === 'Resources'
        ? new DayPilot.Date(this.getWeekStart(start.toDate()))
        : start;
    const daysInView =
      viewType === 'Day'
        ? 0
        : viewType === 'WorkWeek'
          ? 4
          : viewType === 'Days'
            ? Math.max((this.config.days || 1) - 1, 0)
            : 6;
    const lastDay = firstDay.addDays(daysInView);

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

  private getWeekStart(date: Date): Date {
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = (day + 6) % 7; // start week on Monday
    weekStart.setDate(weekStart.getDate() - diff);
    return weekStart;
  }

  private getNavigationOffset(): number {
    if (this.currentView === 'Day') {
      return 1;
    }

    if (this.currentView === 'Days') {
      return Math.max(this.config.days || 1, 1);
    }

    return 7;
  }
}
