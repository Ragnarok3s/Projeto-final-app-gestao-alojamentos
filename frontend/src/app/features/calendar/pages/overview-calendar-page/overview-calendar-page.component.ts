import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DayPilot, DayPilotModule } from '@daypilot/daypilot-lite-angular';

import { ReservationsService } from '../../../reservations/services/reservations.service';
import { Reservation } from '../../../reservations/models/reservation.model';

@Component({
  selector: 'app-overview-calendar-page',
  templateUrl: './overview-calendar-page.component.html',
  styleUrls: ['./overview-calendar-page.component.scss'],
  standalone: true,
  imports: [CommonModule, DayPilotModule]
})
export class OverviewCalendarPageComponent implements OnInit {
  viewDate = DayPilot.Date.today().firstDayOfMonth();
  events: DayPilot.EventData[] = [];

  calendarConfig: DayPilot.CalendarConfig = {
    viewType: 'Days',
    headerDateFormat: 'd',
    startDate: this.viewDate.firstDayOfMonth(),
    days: this.viewDate.daysInMonth()
  };

  constructor(private readonly reservationsService: ReservationsService) {}

  ngOnInit(): void {
    this.loadReservationsForCurrentMonth();
  }

  private loadReservationsForCurrentMonth(): void {
    const from = this.viewDate.firstDayOfMonth().toString('yyyy-MM-dd');
    const to = this.viewDate.addMonths(1).firstDayOfMonth().toString('yyyy-MM-dd');

    this.reservationsService.getOverviewReservations(from, to).subscribe((reservations) => {
      this.events = reservations.map((reservation) => this.mapReservationToEvent(reservation));
    });
  }

  private mapReservationToEvent(reservation: Reservation): DayPilot.EventData {
    const start = new DayPilot.Date(reservation.startDate as any);
    const end = new DayPilot.Date(reservation.endDate as any);
    const startDate = new Date(reservation.startDate as any);
    const endDate = new Date(reservation.endDate as any);
    const nights = Math.max(0, Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));

    const guests = reservation.guestsCount ?? 0;
    const channel = (reservation.channel || 'direct').toLowerCase();
    const total = reservation.totalPrice ?? 0;

    const unitName = reservation.unit?.name || 'Unidade';
    const channelLabel = this.getChannelLabel(channel);
    const color = this.getChannelColor(channel);

    const textLines = [
      unitName,
      `${reservation.guestName || 'Hóspede'} • ${nights} noite${nights !== 1 ? 's' : ''} • ${guests} pax`,
      `${channelLabel} • ${(total / 100).toLocaleString('pt-PT', { style: 'currency', currency: 'EUR' })}`
    ];

    return {
      id: reservation.id,
      start,
      end,
      text: textLines.join('\n'),
      backColor: color,
      borderColor: color
    };
  }

  private getChannelColor(channel: string): string {
    switch (channel) {
      case 'booking':
        return '#4a8dff';
      case 'airbnb':
        return '#ff6b6b';
      case 'expedia':
        return '#ffb347';
      case 'direct':
      default:
        return '#d3d3d3';
    }
  }

  private getChannelLabel(channel: string): string {
    switch (channel) {
      case 'booking':
        return 'Booking.com';
      case 'airbnb':
        return 'Airbnb';
      case 'expedia':
        return 'Expedia';
      case 'direct':
        return 'Directo';
      default:
        return channel;
    }
  }

  goToPreviousMonth(): void {
    this.viewDate = this.viewDate.addMonths(-1);
    this.calendarConfig = {
      ...this.calendarConfig,
      startDate: this.viewDate.firstDayOfMonth(),
      days: this.viewDate.daysInMonth()
    };
    this.loadReservationsForCurrentMonth();
  }

  goToNextMonth(): void {
    this.viewDate = this.viewDate.addMonths(1);
    this.calendarConfig = {
      ...this.calendarConfig,
      startDate: this.viewDate.firstDayOfMonth(),
      days: this.viewDate.daysInMonth()
    };
    this.loadReservationsForCurrentMonth();
  }
}
