import { Component, OnInit, Inject } from '@angular/core';
import { Carrera, PlanCarrera } from 'src/app/models/carrera.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlancarreraService } from 'src/app/services/plancarrera.service';

@Component({
  selector: 'app-asignar-plancarrera',
  templateUrl: './asignar-plancarrera.component.html',
  styleUrls: ['./asignar-plancarrera.component.css']
})
export class AsignarPlancarreraComponent implements OnInit {

  titulo: string;
  carrera: Carrera;
  planCarrera: PlanCarrera;
  formulario: FormGroup;
  error: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AsignarPlancarreraComponent>,
              private fb: FormBuilder,
              private planCarreraService: PlancarreraService) { }

  ngOnInit(): void {
    this.titulo = 'ASIGNAR PLAN CARRERA';
    this.createForm();
    this.carrera = this.data.carrera as Carrera;
    this.planCarrera.carrera = this.carrera;
    this.planCarrera.departamento = this.carrera.departamento;
    this.formulario.controls['carrera'].setValue(this.carrera);
    this.formulario.controls['carrera'].disable();
    this.formulario.controls['departamento'].setValue(this.carrera.departamento);
    this.formulario.controls['departamento'].disable();
  }

  public createForm(): void {
    this.formulario = this.fb.group({
      resolucion: ['', [Validators.required]],
      anioPlan: ['', [Validators.required]],
      carrera: [{value: '', disabled: true}],
      departamento: [{value: '', disabled: true}]
    });
  }

  public save(planCarrera: PlanCarrera) {
    // Desarrollar llamada al backend , persistir el plan carrera
    // Mostrar una alerta de swal
    this.dialogRef.close();
  }

}
