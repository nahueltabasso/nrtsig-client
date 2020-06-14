import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { CarreraComponent } from './components/carrera/carrera.component';
import { AlumnoViewComponent } from './components/alumno/alumno-view/alumno-view.component';
import { AlumnoAddComponent } from './components/alumno/alumno-add/alumno-add.component';
import { AlumnoEditComponent } from './components/alumno/alumno-edit/alumno-edit.component';


const routes: Routes = [
  { path: 'alumnos', component: AlumnoComponent },
  { path: 'alumnos/add', component: AlumnoAddComponent },
  { path: 'alumnos/edit/:id', component: AlumnoEditComponent },
  { path: 'carreras', component: CarreraComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
