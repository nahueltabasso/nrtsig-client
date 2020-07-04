import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PlanCarrera, Departamento, Carrera } from 'src/app/models/carrera.models';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { Router } from '@angular/router';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-carrera-form',
  templateUrl: './plan-carrera-form.component.html',
  styleUrls: ['./plan-carrera-form.component.css']
})
export class PlanCarreraFormComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  planCarrera: PlanCarrera = new PlanCarrera();
  error: string;
  comboDepartamento: Departamento[] = [];
  comboCarrera: Carrera[] = []
  flagError: boolean = false;

  constructor(private planCarreraService: PlancarreraService,
              private carreraService: CarreraService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.createForm();
    this.titulo = 'FORMULARIO ALTA';
    this.carreraService.listarDepartamentos().subscribe(data => {
      this.comboDepartamento = data;
    });
    this.formulario.controls['carrera'].disable();
  }

  public createForm() {
    this.formulario = this.fb.group({
      anioPlan: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      resolucion: ['', [Validators.required]],
      carrera: ['', [Validators.required]],
      departamento: ['', [Validators.required]]
    });
  }

  public onChangeAnioPlan() {
    this.planCarrera.anioPlan = this.formulario.get('anioPlan').value;
  }

  public onChangeResolucion() {
    this.planCarrera.resolucion = this.formulario.get('resolucion').value;
  }

  public seleccionarCarrera(event) {
    this.planCarrera.carrera = event;
  }

  public seleccionarDepartamento(event) {
    this.planCarrera.departamento = event;
    this.carreraService.getCarrerasByDepartamento(this.planCarrera.departamento.id).subscribe(data => {
      this.comboCarrera = data;
      this.formulario.controls['carrera'].enable();
    });
  }

  public save() {
    // Validar que el año del plan sea menor o igual al año actual
    let date = new Date();
    let year = date.getFullYear();
    if (this.planCarrera.anioPlan > year) {
      this.flagError = true;
      this.error = 'El año del plan no puede ser mayor al actual';
      return; 
    }
    this.planCarreraService.crearPlan(this.planCarrera).subscribe(data => {
      if (data != null) {
        Swal.fire('Nuevo', 'Nuevo Plan de Carrera agregado con exito!', 'success');
        this.router.navigate(['/plancarrera']);  
      }
    }, err => {
      console.log(err);
    });
  }
}
