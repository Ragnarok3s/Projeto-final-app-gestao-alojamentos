import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { ReservationsService } from '../../../reservations/services/reservations.service';
import { Reservation } from '../../../reservations/models/reservation.model';
import { Unit } from '../../../units/models/unit.model';

interface CalendarEventView {
  reservationId: number;
  unitId: number;
  unitName: string;
  guestName: string;
  nights: number;
  guests: number;
  channel: string;
  channelLabel: string;
  totalFormatted: string;
  color: string;
  gridStart: number;
  gridEnd: number;
}

interface CalendarRow {
  unit: Unit;
  events: CalendarEventView[];
}

@Component({
  selector: 'app-overview-calendar-page',
  templateUrl: './overview-calendar-page.component.html',
  styleUrls: ['./overview-calendar-page.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class OverviewCalendarPageComponent implements OnInit {
  viewStart!: Date;
  viewEnd!: Date;
  days: Date[] = [];

  rows: CalendarRow[] = [];

  constructor(private readonly reservationsService: ReservationsService) {}

  ngOnInit(): void {
    this.setMonth(new Date());
  }

  previousMonth(): void {
    const previous = new Date(this.viewStart);
    previous.setMonth(previous.getMonth() - 1);
    this.setMonth(previous);
  }

  nextMonth(): void {
    const next = new Date(this.viewStart);
    next.setMonth(next.getMonth() + 1);
    this.setMonth(next);
  }

  private setMonth(base: Date): void {
    this.viewStart = new Date(base.getFullYear(), base.getMonth(), 1);
    this.viewEnd = new Date(base.getFullYear(), base.getMonth() + 1, 1);
    this.buildDays();
    this.loadReservations();
  }

  private buildDays(): void {
    this.days = [];
    const current = new Date(this.viewStart);
    while (current < this.viewEnd) {
      this.days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  private loadReservations(): void {
    const from = this.formatDate(this.viewStart);
    const to = this.formatDate(this.viewEnd);

    this.reservationsService.getOverviewReservations(from, to).subscribe((reservations) => {
      this.rows = this.buildRows(reservations);
    });
  }

  private buildRows(reservations: Reservation[]): CalendarRow[] {
    const unitsMap = new Map<number, Unit>();
    for (const reservation of reservations) {
      if (reservation.unit) {
        unitsMap.set(reservation.unit.id, reservation.unit as Unit);
      }
    }

    const units = Array.from(unitsMap.values()).sort((a, b) => a.name.localeCompare(b.name));

    return units.map((unit) => {
      const unitReservations = reservations.filter((reservation) => reservation.unitId === unit.id);
      const events = unitReservations.map((reservation) => this.mapReservationToEvent(reservation));
      return { unit, events };
    });
  }

  private mapReservationToEvent(reservation: Reservation): CalendarEventView {
    const start = new Date(reservation.startDate as any);
    const end = new Date(reservation.endDate as any);

    const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const msPerDay = 1000 * 60 * 60 * 24;

    const nightsRaw = Math.max(1, Math.round((endDay.getTime() - startDay.getTime()) / msPerDay));
    const startOffset = Math.max(0, Math.floor((startDay.getTime() - this.viewStart.getTime()) / msPerDay));

    const gridStart = startOffset + 1;
    const gridEnd = Math.min(this.days.length + 1, gridStart + nightsRaw);

    const guests = reservation.guestsCount ?? 0;
    const channel = (reservation.channel || 'direct').toLowerCase();
    const total = reservation.totalPrice ?? 0;

    const unitName = reservation.unit?.name || 'Unidade';
    const channelLabel = this.getChannelLabel(channel);
    const color = this.getChannelColor(channel);

    const totalFormatted = (total / 100).toLocaleString('pt-PT', {
      style: 'currency',
      currency: 'EUR'
    });

    return {
      reservationId: reservation.id,
      unitId: reservation.unitId,
      unitName,
      guestName: reservation.guestName || 'Hóspede',
      nights: nightsRaw,
      guests,
      channel,
      channelLabel,
      totalFormatted,
      color,
      gridStart,
      gridEnd
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

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
