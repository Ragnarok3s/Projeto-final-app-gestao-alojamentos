import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';

import { Reservation } from '../../models/reservation.model';

@Component({
  selector: 'app-reservation-detail-dialog',
  standalone: false,
  templateUrl: './reservation-detail-dialog.component.html',
  styleUrls: ['./reservation-detail-dialog.component.scss']
})
export class ReservationDetailDialogComponent implements OnChanges {
  @Input() reservation: Reservation | null = null;
  @Input() errorMessage: string | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() update = new EventEmitter<Partial<Reservation>>();
  @Output() cancelReservation = new EventEmitter<void>();

  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group(
      {
        guestName: ['', Validators.required],
        guestContact: [''],
        notes: [''],
        startDate: ['', Validators.required],
        endDate: ['', Validators.required]
      },
      { validators: this.validateDateRange }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reservation'] && this.reservation) {
      this.form.reset({
        guestName: this.reservation.guestName,
        guestContact: this.reservation.guestContact ?? '',
        notes: this.reservation.notes ?? '',
        startDate: this.reservation.startDate.split('T')[0],
        endDate: this.reservation.endDate.split('T')[0]
      });

      if (this.reservation.status === 'CANCELLED') {
        this.form.disable();
      } else {
        this.form.enable();
      }
    }
  }

  submit(): void {
    if (!this.reservation || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.update.emit(this.form.value as Partial<Reservation>);
  }

  cancel(): void {
    if (!this.reservation || this.reservation.status === 'CANCELLED') {
      return;
    }

    const confirmed = window.confirm('Cancelar esta reserva?');
    if (confirmed) {
      this.cancelReservation.emit();
    }
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
