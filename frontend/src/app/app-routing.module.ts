import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout.component';
import { AuthGuard } from './layout/auth.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app/units' },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'units',
        loadChildren: () => import('./features/units/units.module').then((m) => m.UnitsModule)
      }
    ]
  },
  { path: '**', redirectTo: 'app/units' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
