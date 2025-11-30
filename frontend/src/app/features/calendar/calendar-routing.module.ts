import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../core/guards/auth.guard';
import { OverviewCalendarPageComponent } from './pages/overview-calendar-page/overview-calendar-page.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewCalendarPageComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule {}
