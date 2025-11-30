import { Component, EventEmitter, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';

import { Unit } from '../../../units/models/unit.model';
import { selectAllUnits } from '../../../units/state/units.selectors';
import { CreateReservationPayload } from '../../models/reservation.model';
import { createReservation } from '../../state/reservations.actions';
import { selectReservationsError } from '../../state/reservations.selectors';

@Component({
  selector: 'app-reservation-create-dialog',
  templateUrl: './reservation-create-dialog.component.html',
  styleUrls: ['./reservation-create-dialog.component.scss'],
  standalone: false
})
export class ReservationCreateDialogComponent {
  @Output() close = new EventEmitter<void>();

  form: FormGroup;
  step: 1 | 2 = 1;

  units$: Observable<Unit[]> = this.store.select(selectAllUnits).pipe(map((units) => units.filter((u) => u.isActive)));
  error$: Observable<string | null> = this.store.select(selectReservationsError);

  constructor(private readonly fb: FormBuilder, private readonly store: Store) {
    this.form = this.fb.group(
      {
        unitId: [null, Validators.required],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        guestName: ['', Validators.required],
        guestContact: [''],
        notes: [''],
        status: ['CONFIRMED']
      },
      { validators: this.validateDateRange }
    );
  }

  nextStep(): void {
    const control = this.form.get('unitId');
    if (control?.invalid) {
      control.markAsTouched();
      return;
    }
    this.step = 2;
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.value;
    const payload: CreateReservationPayload = {
      unitId: Number(value.unitId),
      startDate: value.startDate,
      endDate: value.endDate,
      guestName: value.guestName,
      guestContact: value.guestContact,
      notes: value.notes,
      status: value.status
    };

    this.store.dispatch(createReservation({ reservation: payload }));
  }

  cancel(): void {
    this.close.emit();
  }

  get unitControl(): AbstractControl | null {
    return this.form.get('unitId');
  }

  get startDateControl(): AbstractControl | null {
    return this.form.get('startDate');
  }

  get endDateControl(): AbstractControl | null {
    return this.form.get('endDate');
  }

  get guestNameControl(): AbstractControl | null {
    return this.form.get('guestName');
  }

  private validateDateRange(group: AbstractControl): ValidationErrors | null {
    const start = group.get('startDate')?.value;
    const end = group.get('endDate')?.value;

    if (start && end && new Date(start) >= new Date(end)) {
      return { dateRangeInvalid: true };
    }

    return null;
  }
}
