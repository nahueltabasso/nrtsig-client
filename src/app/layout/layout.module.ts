import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuNavegacionComponent } from './menu-navegacion/menu-navegacion.component';
import { AppRoutingModule } from '../app-routing.module';

@NgModule({
  declarations: [MenuNavegacionComponent],
  exports: [MenuNavegacionComponent],
  imports: [
    CommonModule, 
    AppRoutingModule
  ]
})
export class LayoutModule { }
