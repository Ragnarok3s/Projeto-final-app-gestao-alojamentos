import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalendarRoutingModule } from './calendar-routing.module';
import { OverviewCalendarPageComponent } from './pages/overview-calendar-page/overview-calendar-page.component';

@NgModule({
  declarations: [],
  imports: [CommonModule, CalendarRoutingModule, OverviewCalendarPageComponent]
})
export class CalendarModule {}
