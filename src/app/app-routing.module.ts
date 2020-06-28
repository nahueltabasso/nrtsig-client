import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { CarreraComponent } from './components/carrera/carrera.component';
import { AlumnoAddComponent } from './components/alumno/alumno-add/alumno-add.component';
import { AlumnoEditComponent } from './components/alumno/alumno-edit/alumno-edit.component';
import { CarreraAddComponent } from './components/carrera/carrera-add/carrera-add.component';
import { CarreraEditComponent } from './components/carrera/carrera-edit/carrera-edit.component';


const routes: Routes = [
  { path: 'alumnos', component: AlumnoComponent },
  { path: 'alumnos/add', component: AlumnoAddComponent },
  { path: 'alumnos/edit/:id', component: AlumnoEditComponent },
  { path: 'carreras', component: CarreraComponent },
  { path: 'carreras/add', component: CarreraAddComponent },
  { path: 'carreras/edit/:id', component: CarreraEditComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
