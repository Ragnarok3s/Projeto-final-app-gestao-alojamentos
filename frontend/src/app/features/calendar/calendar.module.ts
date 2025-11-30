import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DayPilotModule } from '@daypilot/daypilot-lite-angular';

import { CalendarRoutingModule } from './calendar-routing.module';
import { OverviewCalendarPageComponent } from './pages/overview-calendar-page/overview-calendar-page.component';

@NgModule({
  declarations: [OverviewCalendarPageComponent],
  imports: [CommonModule, DayPilotModule, CalendarRoutingModule]
})
export class CalendarModule {}
