import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ReservationsListPageComponent } from './features/reservations/pages/reservations-list-page/reservations-list-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {
    path: '',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'units',
        loadChildren: () => import('./features/units/units.module').then((m) => m.UnitsModule)
      },
      {
        path: 'calendar-geral',
        loadChildren: () => import('./features/calendar/calendar.module').then((m) => m.CalendarModule)
      },
      {
        path: 'reservas',
        component: ReservationsListPageComponent,
        canActivate: [AuthGuard]
      }
    ]
  },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
