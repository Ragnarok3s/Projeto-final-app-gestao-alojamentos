import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitCalendarPageComponent } from './pages/unit-calendar-page/unit-calendar-page.component';
import { UnitsListPageComponent } from './pages/units-list-page/units-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: UnitsListPageComponent
  },
  {
    path: ':id/calendar',
    component: UnitCalendarPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule {}
