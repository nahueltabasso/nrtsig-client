import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { CarreraComponent } from './components/carrera/carrera.component';
import { AlumnoAddComponent } from './components/alumno/alumno-add/alumno-add.component';
import { AlumnoEditComponent } from './components/alumno/alumno-edit/alumno-edit.component';
import { CarreraAddComponent } from './components/carrera/carrera-add/carrera-add.component';
import { CarreraEditComponent } from './components/carrera/carrera-edit/carrera-edit.component';
import { PlanCarreraComponent } from './components/plan-carrera/plan-carrera.component';
import { PlanCarreraFormComponent } from './components/plan-carrera/plan-carrera-form/plan-carrera-form.component';
import { InscripcionCarreraComponent } from './components/inscripcion-carrera/inscripcion-carrera.component';
import { InscripcionCarreraAddComponent } from './components/inscripcion-carrera/inscripcion-carrera-add/inscripcion-carrera-add.component';
import { InscripcionCarreraEditComponent } from './components/inscripcion-carrera/inscripcion-carrera-edit/inscripcion-carrera-edit.component';
import { ComisionComponent } from './components/comision/comision.component';

const routes: Routes = [
  { path: 'alumnos', component: AlumnoComponent },
  { path: 'alumnos/add', component: AlumnoAddComponent },
  { path: 'alumnos/edit/:id', component: AlumnoEditComponent },
  { path: 'carreras', component: CarreraComponent },
  { path: 'carreras/add', component: CarreraAddComponent },
  { path: 'carreras/edit/:id', component: CarreraEditComponent },
  { path: 'plancarrera', component: PlanCarreraComponent },
  { path: 'plancarrera/add', component: PlanCarreraFormComponent },
  { path: 'inscripcioncarrera', component: InscripcionCarreraComponent },
  { path: 'inscripcioncarrera/add', component: InscripcionCarreraAddComponent },
  { path: 'inscripcioncarrera/edit/:id', component: InscripcionCarreraEditComponent },
  { path: 'inscripcioncarrera/add/:idAlumno', component: InscripcionCarreraAddComponent },
  { path: 'comisiones', component: ComisionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
