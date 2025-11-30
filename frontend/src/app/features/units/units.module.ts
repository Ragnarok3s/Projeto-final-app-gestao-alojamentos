import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';

import { ReservationDetailDialogComponent } from '../reservations/components/reservation-detail-dialog/reservation-detail-dialog.component';
import { ReservationCreateDialogComponent } from '../reservations/components/reservation-create-dialog/reservation-create-dialog.component';
import { CalendarComponent } from '../calendar/calendar.component';
import { UnitCalendarPageComponent } from './pages/unit-calendar-page/unit-calendar-page.component';
import { UnitsListPageComponent } from './pages/units-list-page/units-list-page.component';
import { UnitsRoutingModule } from './units-routing.module';

@NgModule({
  declarations: [
    UnitsListPageComponent,
    UnitCalendarPageComponent,
    ReservationDetailDialogComponent,
    ReservationCreateDialogComponent,
    CalendarComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, DayPilotModule, UnitsRoutingModule]
})
export class UnitsModule {}
