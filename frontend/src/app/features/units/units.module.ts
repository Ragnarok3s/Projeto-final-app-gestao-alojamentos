import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UnitsListPageComponent } from './pages/units-list-page/units-list-page.component';
import { UnitsRoutingModule } from './units-routing.module';

@NgModule({
  declarations: [UnitsListPageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, UnitsRoutingModule]
})
export class UnitsModule {}
