import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

import { Unit } from '../../models/unit.model';
import {
  createUnit,
  loadUnits,
  updateUnit
} from '../../state/units.actions';
import { selectAllUnits, selectUnitsError, selectUnitsLoading } from '../../state/units.selectors';

@Component({
  selector: 'app-units-list-page',
  templateUrl: './units-list-page.component.html',
  styleUrls: ['./units-list-page.component.scss']
})
export class UnitsListPageComponent implements OnInit {
  units$: Observable<Unit[]> = this.store.select(selectAllUnits);
  loading$: Observable<boolean> = this.store.select(selectUnitsLoading);
  error$: Observable<string | null> = this.store.select(selectUnitsError);

  form: FormGroup;
  editingUnitId: number | null = null;

  constructor(private readonly store: Store, private readonly fb: FormBuilder, private readonly router: Router) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.store.dispatch(loadUnits());
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const payload = this.form.value as Partial<Unit>;

    if (this.editingUnitId) {
      this.store.dispatch(updateUnit({ id: this.editingUnitId, changes: payload }));
    } else {
      this.store.dispatch(createUnit({ payload }));
    }

    this.resetForm();
  }

  editUnit(unit: Unit): void {
    this.editingUnitId = unit.id;
    this.form.setValue({ name: unit.name, isActive: unit.isActive });
  }

  resetForm(): void {
    this.editingUnitId = null;
    this.form.reset({ name: '', isActive: true });
  }

  viewCalendar(unit: Unit): void {
    this.router.navigate(['/app/units', unit.id, 'calendar']);
  }
}
