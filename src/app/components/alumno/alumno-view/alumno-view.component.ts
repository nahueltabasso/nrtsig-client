import { Component, OnInit, Inject } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BASE_ENDPOINT } from 'src/app/config/app';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alumno-view',
  templateUrl: './alumno-view.component.html',
})
export class AlumnoViewComponent implements OnInit {

  baseEndPoint = BASE_ENDPOINT + '/usuarios'
  titulo: string;
  alumno: Alumno;
  formulario: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AlumnoViewComponent>,
              private fb: FormBuilder,
              private datePipe: DatePipe){ }

  ngOnInit() {
    this.createForm();
    this.alumno = this.data.alumno as Alumno;
    if (this.alumno.sexo === 'M') {
      this.titulo = 'ALUMNO: ';
    } else {
      this.titulo = 'ALUMNA: ';
    }
    this.loadDataAlumno();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: [{value: '', disabled: true}],
      apellido: [{value: '', disabled: true}],
      legajo: [{value: '', disabled:true}],
      fechaNacimientoTxt: [{value: '', disabled: true}],
      genero: [{value: '', disabled: true}],
      tipoDocumento: [{value: '', disabled: true}],
      numeroDocumento: [{value: '', disabled: true}],
      cuit: [{value: '', disabled: true}],
      email: [{value: '', disabled: true}],
      telefono: [{value: '', disabled: true}],
      direccion: [{value: '', disabled: true}],
      numeroCalle: [{value: '', disabled: true}],
      nroPiso: [{value: '', disabled: true}],
      nroDpto: [{value: '', disabled: true}],
      pais: [{value: '', disabled: true}],
      provincia: [{value: '', disabled: true}],
      ciudad: [{value: '', disabled: true}],
    });
  }

  public loadDataAlumno() {
    // DATOS PERSONALES
    this.formulario.controls['nombre'].setValue(this.alumno.nombre);
    this.formulario.controls['nombre'].disable();
    this.formulario.controls['apellido'].setValue(this.alumno.apellido);
    this.formulario.controls['apellido'].disable();
    this.formulario.controls['legajo'].setValue(this.alumno.legajo);
    this.formulario.controls['legajo'].disable();
    this.formulario.controls['tipoDocumento'].setValue(this.alumno.tipoDocumento);
    this.formulario.controls['tipoDocumento'].disable();
    this.formulario.controls['numeroDocumento'].setValue(this.alumno.numeroDocumento);
    this.formulario.controls['numeroDocumento'].disable();
    this.formulario.controls['fechaNacimientoTxt'].setValue(this.transformDate(this.alumno.fechaNacimiento));
    this.formulario.controls['fechaNacimientoTxt'].disable();
    if (this.alumno.sexo === 'M') {
      this.formulario.controls['genero'].setValue('Hombre');
      this.formulario.controls['genero'].disable();  
    } else {
      this.formulario.controls['genero'].setValue('Mujer');
      this.formulario.controls['genero'].disable();  
    }
    this.formulario.controls['cuit'].setValue(this.alumno.cuit);
    this.formulario.controls['cuit'].disable();

    // DATOS DE DOMICILIO
    this.formulario.controls['direccion'].setValue(this.alumno.domicilio.direccion);
    this.formulario.controls['direccion'].disable();
    this.formulario.controls['numeroCalle'].setValue(this.alumno.domicilio.numero);
    if (this.alumno.domicilio.nroPiso !== null && this.alumno.domicilio.nroDepartamento !== null) {
      this.formulario.controls['nroPiso'].setValue(this.alumno.domicilio.nroPiso);
      this.formulario.controls['nroPiso'].disable();
      this.formulario.controls['nroDpto'].setValue(this.alumno.domicilio.nroDepartamento);
      this.formulario.controls['nroDpto'].disable();
    } else {
      this.formulario.controls['nroPiso'].setValue('---');
      this.formulario.controls['nroPiso'].disable();
      this.formulario.controls['nroDpto'].setValue('---');
      this.formulario.controls['nroDpto'].disable();
    }
    this.formulario.controls['ciudad'].setValue(this.alumno.ciudad.nombre);
    this.formulario.controls['provincia'].setValue(this.alumno.ciudad.provincia.nombre);
    this.formulario.controls['pais'].setValue(this.alumno.ciudad.provincia.pais.nombre);

    // DATOS DE CONTACTO
    this.formulario.controls['email'].setValue(this.alumno.email);
    this.formulario.controls['email'].disable();
    this.formulario.controls['telefono'].setValue(this.alumno.telefono);
    this.formulario.controls['telefono'].disable();
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
