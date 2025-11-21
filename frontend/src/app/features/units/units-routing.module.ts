import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UnitsListPageComponent } from './pages/units-list-page/units-list-page.component';

const routes: Routes = [
  {
    path: '',
    component: UnitsListPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnitsRoutingModule {}
