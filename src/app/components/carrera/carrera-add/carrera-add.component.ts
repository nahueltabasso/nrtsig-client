import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Carrera, TipoCarrera, Departamento, PlanCarrera } from 'src/app/models/carrera.models';
import { CarreraService } from 'src/app/services/carrera.service';
import { Router } from '@angular/router';
import { PATTERN_ONLYLETTERS, PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { AsignarPlancarreraComponent } from '../asignar-plancarrera/asignar-plancarrera.component';

@Component({
  selector: 'app-carrera-add',
  templateUrl: './carrera-add.component.html',
  styleUrls: ['./carrera-add.component.css']
})
export class CarreraAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  carrera: Carrera = new Carrera();
  error: any;
  comboTipoCarrera: TipoCarrera[] = [];
  comboDepartamento: Departamento[] = [];
  flagTab: boolean = false;
  displayedColumnsPlanCarrera: string[] = ['id', 'anioPlan', 'fechaCierre', 'resolucion', 'dpto', 'acciones'];
  displayedColumnsAsignaturas: string[] = [''];
  planesCarreraDataSource: PlanCarrera[] = [];
  
  constructor(private carreraService: CarreraService,
              private fb: FormBuilder,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.carreraService.listarTipoCarrera().subscribe(data => {
      this.comboTipoCarrera = data;
    })
    this.carreraService.listarDepartamentos().subscribe(data1 => {
      this.comboDepartamento = data1;
    })
    this.createForm();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombreCarrera: ['', Validators.compose([Validators.required])],
      nombreCorto: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS)])],
      duracion: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      descripcion: ['', ],
      tipoCarrera: ['', [Validators.required]],
      departamento: ['', [Validators.required]],
    });
  }

  public seleccionarTipoCarrera(event): void {
    this.carrera.tipoCarrera = event;
  }

  public seleccionarDepartamento(event): void {
    this.carrera.departamento = event;
  }

  public onChangeNombreCarrera(): void {
    this.carrera.nombre = this.formulario.controls['nombreCarrera'].value;
  }

  public onChangeNombreCorto(): void {
    this.carrera.nombreCorto = this.formulario.controls['nombreCorto'].value;
  }

  public onChangeDuracion(): void {
    this.carrera.duracion = this.formulario.controls['duracion'].value;
  }

  public onChangeDescripcion(): void {
    this.carrera.descripcion = this.formulario.controls['descripcion'].value;
  }

  public save() {
    // Guardar la carrera
    this.carreraService.crearCarrera(this.carrera).subscribe(data => {
      this.carrera = data;
      console.log('save',this.carrera)
      Swal.fire('Nuevo:', `Carrera ${this.carrera.nombre} agregada con exito!`, 'success');
      // Deshabilitar los campos del formulario carrera para poder ingresar en el plan de carreras y las materias
      this.formulario.controls['nombreCarrera'].disable();
      this.formulario.controls['nombreCorto'].disable();
      this.formulario.controls['duracion'].disable();
      this.formulario.controls['descripcion'].disable();
      this.formulario.controls['tipoCarrera'].disable();
      this.formulario.controls['departamento'].disable();
      // Muesto los tabs
      this.flagTab = true;
    });
  }

  public asignarPlanCarrera(): void {
    const modalRef = this.dialog.open(AsignarPlancarreraComponent, {
      width: '75%',
      data: { carrera: this.carrera }
    });
    modalRef.afterClosed().subscribe(data => {
      // desarrollar la logica para completar la grilla del tab PLAN CARRERA
      // realizar el request al backend 
    });
  }

}
