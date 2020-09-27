import { Component, OnInit, Inject } from '@angular/core';
import { Comision } from 'src/app/models/carrera.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-comision-view',
  templateUrl: './comision-view.component.html',
  styleUrls: ['./comision-view.component.css']
})
export class ComisionViewComponent implements OnInit {

  titulo: string;
  comision: Comision;
  formulario: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<ComisionViewComponent>,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.createForm();
    this.comision = this.data.comision as Comision;
    this.loadData();
    this.titulo = `Comision ${this.comision.numeroComision} - ${this.comision.planCarrera.carrera.nombre}`;
  }

  public createForm() {
    this.formulario = this.fb.group({
      id: [{value: '', disabled: true}],
      numeroComision: [{value: '', disabled: true}],
      capacidadMax: [{value: '', disabled: true}],
      capacidadActual: [{value: '', disabled: true}],
      fechaAlta: [{value: '', disabled: true}],
      carrera: [{value: '', disabled: true}],
      turno: [{value: '', disabled: true}]
    });
  }

  public loadData() {
    // DATOS DE LA COMISION
    this.formulario.controls['id'].setValue(this.comision.id);
    this.formulario.controls['numeroComision'].setValue(this.comision.numeroComision);
    this.formulario.controls['capacidadMax'].setValue(this.comision.capacidadMaxima);
    this.formulario.controls['capacidadActual'].setValue(this.comision.capacidadActual);
    this.formulario.controls['fechaAlta'].setValue(this.transformDate(this.comision.createAt));
    this.formulario.controls['carrera'].setValue(this.comision.planCarrera.carrera.nombre);
    if (this.comision.turnoCursado === 1) this.formulario.controls['turno'].setValue('Mañana');
    if (this.comision.turnoCursado === 2) this.formulario.controls['turno'].setValue('Tarde');
    if (this.comision.turnoCursado === 3) this.formulario.controls['turno'].setValue('Noche');
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
