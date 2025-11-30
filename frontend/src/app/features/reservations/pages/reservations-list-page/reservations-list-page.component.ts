import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Reservation } from '../../models/reservation.model';
import { ReservationsListFilters } from '../../services/reservations.service';
import * as ReservationsActions from '../../state/reservations.actions';
import * as ReservationsSelectors from '../../state/reservations.selectors';
import * as UnitsSelectors from '../../../units/state/units.selectors';
import { Unit } from '../../../units/models/unit.model';
import { loadUnits } from '../../../units/state/units.actions';

@Component({
  selector: 'app-reservations-list-page',
  templateUrl: './reservations-list-page.component.html',
  styleUrls: ['./reservations-list-page.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ReservationsListPageComponent implements OnInit {
  filtersForm = this.fb.group({
    from: [''],
    to: [''],
    unitId: [''],
    status: ['ALL'],
    channel: [''],
    q: ['']
  });

  reservations$: Observable<Reservation[]> = this.store.select(ReservationsSelectors.selectReservationsList);
  loading$: Observable<boolean> = this.store.select(ReservationsSelectors.selectReservationsListLoading);

  units$: Observable<Unit[]> = this.store.select(UnitsSelectors.selectAllUnits);

  constructor(private fb: FormBuilder, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(loadUnits());
    this.loadDefault();
  }

  applyFilters(): void {
    const raw = this.filtersForm.value;

    const filters: ReservationsListFilters = {
      from: raw.from || undefined,
      to: raw.to || undefined,
      unitId: raw.unitId ? Number(raw.unitId) : undefined,
      status: (raw.status as ReservationsListFilters['status']) || 'ALL',
      channel: raw.channel || undefined,
      q: raw.q || undefined
    };

    this.store.dispatch(ReservationsActions.loadReservationsList({ filters }));
  }

  clearFilters(): void {
    this.filtersForm.reset({
      from: '',
      to: '',
      unitId: '',
      status: 'ALL',
      channel: '',
      q: ''
    });
    this.applyFilters();
  }

  cancelReservation(reservation: Reservation): void {
    const confirmed = confirm('Tens a certeza que queres cancelar esta reserva?');
    if (!confirmed) return;

    this.store.dispatch(ReservationsActions.cancelReservation({ id: reservation.id }));
  }

  viewReservation(_reservation: Reservation): void {
    // Placeholder: connect to reservation detail dialog if available
  }

  getNights(reservation: Reservation): number {
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);

    const startUtc = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
    const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate());

    const nights = Math.max(0, Math.round((endUtc - startUtc) / (1000 * 60 * 60 * 24)));
    return nights || 1;
  }

  private loadDefault(): void {
    const today = new Date();
    const from = new Date(today.getFullYear(), today.getMonth(), 1);
    const to = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    this.filtersForm.patchValue({
      from: this.formatDate(from),
      to: this.formatDate(to),
      status: 'ALL'
    });

    this.applyFilters();
  }

  private formatDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
}
