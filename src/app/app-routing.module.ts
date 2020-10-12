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
import { DocenteComponent } from './components/docente/docente.component';
import { DocenteViewComponent } from './components/docente/docente-view/docente-view.component';
import { DocenteAddComponent } from './components/docente/docente-add/docente-add.component';
import { DocenteEditComponent } from './components/docente/docente-edit/docente-edit.component';
import { AsignaturaComponent } from './components/asignatura/asignatura.component';
import { AsignaturaAddComponent } from './components/asignatura/asignatura-add/asignatura-add.component';
import { AsignaturaEditComponent } from './components/asignatura/asignatura-edit/asignatura-edit.component';
import { InscripcionListComponent } from './components/inscripcion-asignatura/inscripcion-list/inscripcion-list.component';
import { InscripcionAddComponent } from './components/inscripcion-asignatura/inscripcion-add/inscripcion-add.component';

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
  { path: 'comisiones', component: ComisionComponent },
  { path: 'docente', component: DocenteComponent },
  { path: 'docente/view/:id', component: DocenteViewComponent },
  { path: 'docente/add', component: DocenteAddComponent },
  { path: 'docente/edit/:id', component: DocenteEditComponent },
  { path: 'asignatura', component: AsignaturaComponent },
  { path: 'asignatura/add', component: AsignaturaAddComponent },
  { path: 'asignatura/edit/:id', component: AsignaturaEditComponent },
  { path: 'inscripcionesasignatura', component: InscripcionListComponent },
  { path: 'inscripcionesasignatura/add', component: InscripcionAddComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
