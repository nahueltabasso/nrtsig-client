import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { DatePipe } from '@angular/common';
import { PlanCarrera } from 'src/app/models/carrera.models';

@Component({
  selector: 'app-plan-carrera-view',
  templateUrl: './plan-carrera-view.component.html',
  styleUrls: ['./plan-carrera-view.component.css']
})
export class PlanCarreraViewComponent implements OnInit {

  titulo: string;
  planCarrera: PlanCarrera;
  formulario: FormGroup;
  error: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<PlanCarreraViewComponent>,
              private fb: FormBuilder,
              private planCarreraService: PlancarreraService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.createForm();
    this.planCarrera = this.data.planCarrera as PlanCarrera;
    this.loadData();
    this.titulo = `Plan ${this.planCarrera.anioPlan} de ${this.planCarrera.carrera.nombre}`;
    this.titulo.toUpperCase();
  }

  public createForm() {
    this.formulario = this.fb.group({
      anioPlan: [{value: '', disabled: true}],
      resolucion: [{value: '', disabled: true}],
      createAt: [{value: '', disabled: true}],
      fechaCierre: [{value: '', disabled: true}],
      carrera: [{value: '', disabled: true}],
      departamento: [{value: '', disabled: true}]
    });
  }

  public loadData(): void {
    // DATOS DEL PLAN
    this.formulario.controls['anioPlan'].setValue(this.planCarrera.anioPlan);
    this.formulario.controls['resolucion'].setValue(this.planCarrera.resolucion);
    this.formulario.controls['createAt'].setValue(this.transformDate(this.planCarrera.createAt));
    if (this.planCarrera.fechaCierre != null) {
      this.formulario.controls['fechaCierre'].setValue(' - ');
    } else {
      this.formulario.controls['fechaCierre'].setValue(this.transformDate(this.planCarrera.fechaCierre));
    }
    this.formulario.controls['carrera'].setValue(this.planCarrera.carrera.nombre);
    this.formulario.controls['departamento'].setValue(this.planCarrera.departamento.denominacion);
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
