import { Component, OnInit, Inject } from '@angular/core';
import { Alumno } from 'src/app/models/alumno.models';
import { AlumnoService } from 'src/app/services/alumno.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alumno-view',
  templateUrl: './alumno-view.component.html',
})
export class AlumnoViewComponent implements OnInit {

  alumno: Alumno;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any){ }

  ngOnInit() {
    this.alumno = this.data.alumno as Alumno;
  }

}
