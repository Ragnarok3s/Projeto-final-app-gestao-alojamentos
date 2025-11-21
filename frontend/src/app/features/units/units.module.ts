import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';

import { ReservationDetailDialogComponent } from '../reservations/components/reservation-detail-dialog/reservation-detail-dialog.component';
import { UnitCalendarPageComponent } from './pages/unit-calendar-page/unit-calendar-page.component';
import { UnitsListPageComponent } from './pages/units-list-page/units-list-page.component';
import { UnitsRoutingModule } from './units-routing.module';

@NgModule({
  declarations: [UnitsListPageComponent, UnitCalendarPageComponent, ReservationDetailDialogComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, FullCalendarModule, UnitsRoutingModule]
})
export class UnitsModule {}
