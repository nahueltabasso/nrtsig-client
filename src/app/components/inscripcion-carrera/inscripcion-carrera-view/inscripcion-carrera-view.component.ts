import { Component, OnInit, Inject } from '@angular/core';
import { InscripcionCarrera } from 'src/app/models/inscripcion.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AlumnoViewComponent } from '../../alumno/alumno-view/alumno-view.component';
import { CarreraViewComponent } from '../../carrera/carrera-view/carrera-view.component';

@Component({
  selector: 'app-inscripcion-carrera-view',
  templateUrl: './inscripcion-carrera-view.component.html',
  styleUrls: ['./inscripcion-carrera-view.component.css']
})
export class InscripcionCarreraViewComponent implements OnInit {

  titulo: string;
  inscripcionCarrera: InscripcionCarrera;
  formulario: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA)public data: any,
              public dialogRef: MatDialogRef<InscripcionCarreraViewComponent>,
              private datePipe: DatePipe,
              private fb: FormBuilder,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.inscripcionCarrera = this.data.inscripcionCarrera as InscripcionCarrera;
    this.loadData();
    this.titulo = 'Inscripcion N° ' + this.inscripcionCarrera.id + ' - ' + this.inscripcionCarrera.alumno.apellido + ', ' + this.inscripcionCarrera.alumno.nombre;
    this.titulo.toUpperCase();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nroInscripcion: [{value: '', disabled: true}],
      fechaInscripcion: [{value: '', disabled: true}],
      cantidadAsignaturasAprob: [{value: '', disabled: true}],
      fechaEgreso: [{value: '', disabled: true}],
      estadoCarrera: [{value: '', disabled: true}],
      estadoInscripcion: [{value: '', disabled: true}],
      notaPromedio: [{value: '', disabled: true}],
      legajoAlumno: [{value: '', disabled: true}],
      nombreApellido: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      tipoNroDocumento: [{value: '', disabled: true}],
      fechaNacimiento: [{value: '', disabled: true}],
      genero: [{value: '', disabled: true}],
      nombreCarrera: [{value: '', disabled: true}],
      nombreCorto: [{value: '', disabled: true}],
      duracion: [{value: '', disabled: true}],
      departamento: [{value: '', disabled: true}],
      anioPlanCarrera: [{value: '', disabled: true}],
      resolucion: [{value: '', disabled: true}]
    });
  }

  public loadData() {
    // DATOS DE LA INSCRIPCION
    this.formulario.controls['nroInscripcion'].setValue(this.inscripcionCarrera.id);
    this.formulario.controls['fechaInscripcion'].setValue(this.transformDate(this.inscripcionCarrera.fechaInscripcion));
    this.formulario.controls['cantidadAsignaturasAprob'].setValue(this.inscripcionCarrera.cantidadAsignaturas);
    if (this.inscripcionCarrera.fechaEgreso !== null) {
      this.formulario.controls['fechaEgreso'].setValue(this.transformDate(this.inscripcionCarrera.fechaEgreso));
    } else {
      this.formulario.controls['fechaEgreso'].setValue('Cursando');
    }
    this.formulario.controls['notaPromedio'].setValue(this.inscripcionCarrera.notaPromedio);
    this.formulario.controls['estadoCarrera'].setValue(this.inscripcionCarrera.estadoCarrera.descripcion);
    this.formulario.controls['estadoInscripcion'].setValue(this.inscripcionCarrera.estadoInscripcion.descripcion);

    // DATOS DEL ALUMNO
    this.formulario.controls['legajoAlumno'].setValue(this.inscripcionCarrera.alumno.legajo);
    const nombreApellido = this.inscripcionCarrera.alumno.apellido + ', ' + this.inscripcionCarrera.alumno.nombre;
    this.formulario.controls['nombreApellido'].setValue(nombreApellido);
    this.formulario.controls['email'].setValue(this.inscripcionCarrera.alumno.email);
    const tipoNroDocumento = this.inscripcionCarrera.alumno.tipoDocumento + ': ' + this.inscripcionCarrera.alumno.numeroDocumento;
    this.formulario.controls['tipoNroDocumento'].setValue(tipoNroDocumento);  
    this.formulario.controls['fechaNacimiento'].setValue(this.transformDate(this.inscripcionCarrera.alumno.fechaNacimiento)); 
    this.formulario.controls['genero'].setValue(this.inscripcionCarrera.alumno.sexo);

    // DATOS DE LA CARRERA
    let carrera = this.inscripcionCarrera.planCarrera.carrera;
    this.formulario.controls['nombreCarrera'].setValue(carrera.nombre);
    this.formulario.controls['nombreCorto'].setValue(carrera.nombreCorto);
    const duracion = `${carrera.duracion} años`;
    this.formulario.controls['duracion'].setValue(duracion);
    this.formulario.controls['departamento'].setValue(carrera.departamento.denominacion);

    // DATOS DEL PLAN DE CARRERA
    this.formulario.controls['anioPlanCarrera'].setValue(this.inscripcionCarrera.planCarrera.anioPlan);
    this.formulario.controls['resolucion'].setValue(this.inscripcionCarrera.planCarrera.resolucion);
  }

  public close() {
    this.dialogRef.close();
  }

  public verPerfilAlumno() {
    const modalRef = this.dialog.open(AlumnoViewComponent, {
      width: '100%',
      data: { alumno: this.inscripcionCarrera.alumno }
    });
    modalRef.afterClosed().subscribe(data => {});
  }

  public verCarrera() {
    const modalRef = this.dialog.open(CarreraViewComponent, {
      width: '100%',
      data: { carrera: this.inscripcionCarrera.planCarrera.carrera }
    });
    modalRef.afterClosed().subscribe(data => {});
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }
}
