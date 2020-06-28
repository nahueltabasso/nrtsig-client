import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Carrera, PlanCarrera } from 'src/app/models/carrera.models';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { CarreraService } from 'src/app/services/carrera.service';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { Alumno } from 'src/app/models/alumno.models';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-carrera-view',
  templateUrl: './carrera-view.component.html',
  styleUrls: ['./carrera-view.component.css']
})
export class CarreraViewComponent implements OnInit {

  titulo: string;
  carrera: Carrera;
  formulario: FormGroup;
  error: any;
  planCarreraVigente: PlanCarrera = new PlanCarrera();
  alumnosInscriptos: Alumno[] = [];
  displayedColumnsAlumnos: string[] = ['nombre', 'apellido', 'nroDni', 'acciones'];
  resultLength: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<CarreraViewComponent>,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private carreraService: CarreraService,
              private planCarreraService: PlancarreraService) { }

  ngOnInit(): void {
    this.createForm();
    this.carrera = this.data.carrera as Carrera;
    this.planCarreraService.obtenerPlanCarreraVigente(this.carrera.id).subscribe(data => {
      this.planCarreraVigente = data;
      this.alumnosInscriptos = this.planCarreraVigente.alumnosInscriptos;
      this.resultLength = this.alumnosInscriptos.length;
      this.loadData();
    });
    this.titulo = this.carrera.nombre.toUpperCase();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombreCarrera: [{value: '', disabled: true}],
      nombreCorto: [{value: '', disabled: true}],
      duracion: [{value: '', disabled: true}],
      descripcion: [{value: '', disabled: true}],
      createAt: [{value: '', disabled: true}],
      anioPlan: [{value: '', disabled: true}],
      resolucion: [{value: '', disabled: true}],
      cantidadAlumnosInscriptos: [{value: '', disabled: true}],
      idTipoCarrera: [{value: '', disabled: true}],
      tipoCarrera: [{value: '', disabled: true}],
      idDpto: [{value: '', disabled: true}],
      codigoDpto: [{value: '', disabled: true}],
      denominacionDpto: [{value: '', disabled: true}]
    });
  }

  public loadData() {
    // DATOS DE LA CARRERA
    this.formulario.controls['nombreCarrera'].setValue(this.carrera.nombre);
    this.formulario.controls['nombreCarrera'].disable();
    this.formulario.controls['nombreCorto'].setValue(this.carrera.nombreCorto);
    this.formulario.controls['nombreCorto'].disable();
    this.formulario.controls['duracion'].setValue(this.carrera.duracion + ' años');    
    this.formulario.controls['duracion'].disable();
    this.formulario.controls['descripcion'].setValue(this.carrera.descripcion);
    this.formulario.controls['descripcion'].disable();
    this.formulario.controls['createAt'].setValue(this.transformDate(this.carrera.createAt));
    this.formulario.controls['createAt'].disable();

    // DATOS DEL PLAN DE CARRERA VIGENTE
    this.formulario.controls['anioPlan'].setValue(this.planCarreraVigente.anioPlan);
    this.formulario.controls['anioPlan'].disable();
    this.formulario.controls['resolucion'].setValue(this.planCarreraVigente.resolucion);
    this.formulario.controls['resolucion'].disable();
    this.formulario.controls['cantidadAlumnosInscriptos'].setValue(this.planCarreraVigente.alumnosInscriptos.length + ' alumnos');
    this.formulario.controls['cantidadAlumnosInscriptos'].disable();

    // DATOS DEL TIPO DE CARRERA
    this.formulario.controls['idTipoCarrera'].setValue(this.carrera.tipoCarrera.id);
    this.formulario.controls['idTipoCarrera'].disable();
    this.formulario.controls['tipoCarrera'].setValue(this.carrera.tipoCarrera.tipoCarrera);
    this.formulario.controls['tipoCarrera'].disable();

    // DATOS DEL DEPARTAMENTO
    this.formulario.controls['idDpto'].setValue(this.carrera.departamento.id);
    this.formulario.controls['idDpto'].disable();
    this.formulario.controls['denominacionDpto'].setValue(this.carrera.departamento.denominacion);
    this.formulario.controls['denominacionDpto'].disable();
    this.formulario.controls['codigoDpto'].setValue(this.carrera.departamento.codigo);
    this.formulario.controls['codigoDpto'].disable();
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
