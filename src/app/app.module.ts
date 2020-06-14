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
import { AlumnoViewComponent } from './components/alumno/alumno-view/alumno-view.component';
import { AlumnoAddComponent } from './components/alumno/alumno-add/alumno-add.component';
import { AlumnoEditComponent } from './components/alumno/alumno-edit/alumno-edit.component';

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
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    AlumnoComponent,
    CarreraComponent,
    AlumnoViewComponent,
    AlumnoAddComponent,
    AlumnoEditComponent
  ],
  entryComponents: [
    AlumnoViewComponent
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
    MatIconModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
