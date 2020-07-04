import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanCarrera, Carrera, TipoCarrera, Departamento, PlanCarreraFiltrosDTO } from 'src/app/models/carrera.models';
import { MatTableDataSource } from '@angular/material/table';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { PATTERN_ONLYNUMBER, MAX_LENGTH_ANIOPLAN, LABEL_PAGINADOR } from 'src/app/shared/constants';
import { CarreraService } from 'src/app/services/carrera.service';
import { PlanCarreraViewComponent } from './plan-carrera-view/plan-carrera-view.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-plan-carrera',
  templateUrl: './plan-carrera.component.html',
  styleUrls: ['./plan-carrera.component.css']
})
export class PlanCarreraComponent implements OnInit {

  titulo: string = 'LISTADO DE PLANES CARRERA';
  planCarreraList: PlanCarrera[] = [];
  dataSource: MatTableDataSource<PlanCarrera>;
  displayedColumns: string[] = ['id', 'anioPlan', 'fechaCierre', 'resolucion', 'createAt', 'carrera', 'dpto', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  formulario: FormGroup;
  loading: boolean = false;
  planCarreraFiltrosDTO: PlanCarreraFiltrosDTO = new PlanCarreraFiltrosDTO();
  comboCarreras: Carrera[] = [];
  comboTipoCarrera: TipoCarrera[] = [];
  comboDepartamento: Departamento[] = [];

  constructor(private planCarreraService: PlancarreraService,
              private carreraService: CarreraService,
              public dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.loading = true;
    this.planCarreraService.listar().subscribe(data => {
      this.planCarreraList = data;
      this.iniciarPaginador();
      this.loading = false;
      });
    this.carreraService.getCarreraOrdenadasPorNombre().subscribe(carreras => {
      this.comboCarreras = carreras;
    });
    this.carreraService.listarTipoCarrera().subscribe(tipoCarrera => {
      this.comboTipoCarrera = tipoCarrera;
    });
    this.carreraService.listarDepartamentos().subscribe(dpto => {
      this.comboDepartamento = dpto;
    });
    this.formulario.controls['anioPlanDesde'].setValue('');
    this.formulario.controls['anioPlanHasta'].setValue('');
    this.formulario.controls['carrera'].setValue(null);
    this.formulario.controls['tipoCarrera'].setValue(null);
    this.formulario.controls['dpto'].setValue(null);
  }

  public createForm() {
    this.formulario = this.fb.group({
      anioPlanDesde: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_ANIOPLAN)])],
      anioPlanHasta: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_ANIOPLAN)])],
      carrera: ['', ],
      dpto: ['', ],
      tipoCarrera: ['', ]
    });
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<PlanCarrera>(this.planCarreraList);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeAnioPlanDesde() {
    this.planCarreraFiltrosDTO.anioPlanDesde = this.formulario.controls['anioPlanDesde'].value;
  }

  public onChangeAnioPlanHasta() {
    this.planCarreraFiltrosDTO.anioPlanHasta = this.formulario.controls['anioPlanHasta'].value;
  }

  public seleccionarTipoCarrera(event) {
    this.planCarreraFiltrosDTO.tipoCarrera = event;
  }

  public seleccionarCarrera(event) {
    this.planCarreraFiltrosDTO.carrera = event;
  }

  public seleccionarDepartamento(event) {
    this.planCarreraFiltrosDTO.dpto = event;
  }

  public verPlanCarrera(planCarrera: PlanCarrera): void {
    const modalRef = this.dialog.open(PlanCarreraViewComponent, {
      width: '50%',
      data: { planCarrera: planCarrera }
    });
    modalRef.afterClosed().subscribe(data => {
        
    });
  }

  public search() {
    this.loading = true;
    this.planCarreraService.search(this.planCarreraFiltrosDTO).subscribe(data => {
      this.planCarreraList = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public cleanFilter() {
    this.planCarreraFiltrosDTO = new PlanCarreraFiltrosDTO();
    this.formulario.controls['anioPlanDesde'].setValue('');
    this.formulario.controls['anioPlanHasta'].setValue('');
    this.formulario.controls['carrera'].setValue(null);
    this.formulario.controls['tipoCarrera'].setValue(null);
    this.formulario.controls['dpto'].setValue(null);
    this.ngOnInit();
  }

  public eliminarPlan(planCarrera: PlanCarrera): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea eliminar el plan de ${planCarrera.carrera.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.planCarreraService.eliminarPlanCarrera(planCarrera.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', 'Plan eliminado con exito!', 'success');
        });
      }
    });
  }

  public cerrarPlan(planCarrera: PlanCarrera) {
    this.planCarreraService.cerrarPlanCarrera(planCarrera.id).subscribe(data => {
      this.carreraService.desactivarCarrera(planCarrera.carrera.id).subscribe(data => {
        Swal.fire('Atencion', 'El Plan de Carrera fue cerrado con exito!', 'info');
      });
    });
  }

}
