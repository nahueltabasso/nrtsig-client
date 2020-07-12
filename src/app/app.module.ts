import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlumnoComponent } from './components/alumno/alumno.component';
import { CarreraComponent } from './components/carrera/carrera.component';
import { HttpClientModule } from '@angular/common/http';
import { LayoutModule } from './layout/layout.module';

// IMPORTS DE ANGULAR MATERIAL
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';

// IMPORTS DE PIPES
import { DatePipe } from '@angular/common';

// IMPORTS DE COMPONENTES
import { AlumnoViewComponent } from './components/alumno/alumno-view/alumno-view.component';
import { AlumnoAddComponent } from './components/alumno/alumno-add/alumno-add.component';
import { AlumnoEditComponent } from './components/alumno/alumno-edit/alumno-edit.component';
import { CarreraViewComponent } from './components/carrera/carrera-view/carrera-view.component';
import { CarreraAddComponent } from './components/carrera/carrera-add/carrera-add.component';
import { CarreraEditComponent } from './components/carrera/carrera-edit/carrera-edit.component';
import { AsignarPlancarreraComponent } from './components/carrera/asignar-plancarrera/asignar-plancarrera.component';
import { PlanCarreraComponent } from './components/plan-carrera/plan-carrera.component';
import { PlanCarreraViewComponent } from './components/plan-carrera/plan-carrera-view/plan-carrera-view.component';
import { PlanCarreraFormComponent } from './components/plan-carrera/plan-carrera-form/plan-carrera-form.component';
import { InscripcionCarreraComponent } from './components/inscripcion-carrera/inscripcion-carrera.component';
import { InscripcionCarreraAddComponent } from './components/inscripcion-carrera/inscripcion-carrera-add/inscripcion-carrera-add.component';
import { InscripcionCarreraViewComponent } from './components/inscripcion-carrera/inscripcion-carrera-view/inscripcion-carrera-view.component';
import { InscripcionCarreraEditComponent } from './components/inscripcion-carrera/inscripcion-carrera-edit/inscripcion-carrera-edit.component';


@NgModule({
  declarations: [
    AppComponent,
    AlumnoComponent,
    CarreraComponent,
    AlumnoViewComponent,
    AlumnoAddComponent,
    AlumnoEditComponent,
    CarreraViewComponent,
    CarreraAddComponent,
    CarreraEditComponent,
    AsignarPlancarreraComponent,
    PlanCarreraComponent,
    PlanCarreraViewComponent,
    PlanCarreraFormComponent,
    InscripcionCarreraComponent,
    InscripcionCarreraAddComponent,
    InscripcionCarreraViewComponent,
    InscripcionCarreraEditComponent
  ],
  entryComponents: [
    AlumnoViewComponent,
    CarreraViewComponent,
    AsignarPlancarreraComponent,
    PlanCarreraViewComponent,
    InscripcionCarreraViewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatPaginatorModule,
    MatTableModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatIconModule,
    MatStepperModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
