import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { CarreraComponent } from './components/carrera/carrera.component';
import { AlumnoViewComponent } from './components/alumno/alumno-view/alumno-view.component';


const routes: Routes = [
  { path: 'alumnos', component: AlumnoComponent },
  { path: 'carreras', component: CarreraComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
