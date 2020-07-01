import { Component, OnInit, Inject } from '@angular/core';
import { Carrera, PlanCarrera } from 'src/app/models/carrera.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import Swal from 'sweetalert2';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';

@Component({
  selector: 'app-asignar-plancarrera',
  templateUrl: './asignar-plancarrera.component.html',
  styleUrls: ['./asignar-plancarrera.component.css']
})
export class AsignarPlancarreraComponent implements OnInit {

  titulo: string;
  carrera: Carrera;
  planCarrera: PlanCarrera = new PlanCarrera();
  formulario: FormGroup;
  error: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AsignarPlancarreraComponent>,
              private fb: FormBuilder,
              private planCarreraService: PlancarreraService) { }

  ngOnInit(): void {
    this.titulo = 'ASIGNAR PLAN CARRERA';
    this.carrera = this.data.carrera as Carrera;
    this.createForm();
    this.formulario.controls['carrera'].setValue(this.carrera.nombre);
    this.formulario.controls['carrera'].disable();
    this.formulario.controls['departamento'].setValue(this.carrera.departamento.denominacion);
    this.formulario.controls['departamento'].disable();
    this.planCarrera.carrera = this.data.carrera;
    this.planCarrera.departamento = this.data.carrera.departamento;
  }

  public createForm(): void {
    this.formulario = this.fb.group({
      resolucion: ['', [Validators.required]],
      anioPlan: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      carrera: [{value: '', disabled: true}],
      departamento: [{value: '', disabled: true}]
    });
  }

  public onChangeAnioPlan() {
    this.planCarrera.anioPlan = this.formulario.get('anioPlan').value;
  }

  public onChangeResolucion() {
    this.planCarrera.resolucion = this.formulario.get('resolucion').value;
  }

  public save() {
    // Validar que el anio del plan sea menor o igual al año actual
    let date = new Date();
    let year = date.getFullYear();
    if (this.planCarrera.anioPlan > year) {
      this.error = true;
      return; 
    }
    // Desarrollar llamada al backend , persistir el plan carrera
    this.planCarreraService.save(this.planCarrera).subscribe(data => {
      Swal.fire('Nuevo', 'Plan asignado con exito!', 'success');
      this.carrera.planesCarrera.push(this.planCarrera);
      this.dialogRef.close();
    });
  }

  public close() {
    this.dialogRef.close();
  }

}
