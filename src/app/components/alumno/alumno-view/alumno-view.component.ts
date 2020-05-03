import { Component, OnInit, Inject } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.models';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BASE_ENDPOINT } from 'src/app/config/app';

@Component({
  selector: 'app-alumno-view',
  templateUrl: './alumno-view.component.html',
})
export class AlumnoViewComponent implements OnInit {

  baseEndPoint = BASE_ENDPOINT + '/usuarios'
  titulo: string;
  alumno: Alumno;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AlumnoViewComponent>){ }

  ngOnInit() {
    this.alumno = this.data.alumno as Alumno;
    if (this.alumno.sexo === 'M') {
      this.titulo = 'ALUMNO: ';
    } else {
      this.titulo = 'ALUMNA: ';
    }
  }

  close() {
    this.dialogRef.close();
  }

}
