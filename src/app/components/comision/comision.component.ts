import { Component, OnInit, ViewChild } from '@angular/core';
import { Comision, Carrera, ComisionFiltrosDTO } from 'src/app/models/carrera.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarreraService } from 'src/app/services/carrera.service';
import { ComisionService } from 'src/app/services/comision.service';
import { PATTERN_ONLYNUMBER, LABEL_PAGINADOR } from 'src/app/shared/constants';
import { MatDialog } from '@angular/material/dialog';
import { ComisionViewComponent } from './comision-view/comision-view.component';
import { ComisionAddComponent } from './comision-add/comision-add.component';
import Swal from 'sweetalert2';
import { AsignarAulaComponent } from './asignar-aula/asignar-aula.component';
import { ComisionEditComponent } from './comision-edit/comision-edit.component';

@Component({
  selector: 'app-comision',
  templateUrl: './comision.component.html',
  styleUrls: ['./comision.component.css']
})
export class ComisionComponent implements OnInit {

  titulo: string = 'LISTADO DE COMISIONES';
  comisiones: Comision[] = [];
  dataSource: MatTableDataSource<Comision>;
  displayedColumns: string[] = ['nroComision', 'carrera', 'turno', 'capacidadMax', 'capacidadActual', 'createAt', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  comboCarrera: Carrera[] = [];
  comisionFiltrosDTO: ComisionFiltrosDTO = new ComisionFiltrosDTO();

  constructor(private carreraService: CarreraService,
              private comisionService: ComisionService,
              private fb: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.loading = true;
    this.comisionService.listar().subscribe(data => {
      this.comisiones = data;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.carreraService.listar().subscribe(data1 => {
      this.comboCarrera = data1;
    });
    this.formulario.controls['numeroComision'].setValue('');
    this.formulario.controls['carrera'].setValue(null);
  }

  public createForm() {
    this.formulario = this.fb.group({
      numeroComision: ['', Validators.pattern(PATTERN_ONLYNUMBER)],
      carrera: ['', ],
      turno: ['', ]
    })
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Comision>(this.comisiones);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNumeroComision() {
    this.comisionFiltrosDTO.numeroComision = this.formulario.controls['numeroComision'].value;  
  }

  public seleccionarCarrera(event): void {
    this.comisionFiltrosDTO.carrera = event;
  }

  public seleccionarTurnoComision(event) {
    this.comisionFiltrosDTO.turnoCursado = event;
  }

  public verComision(comision: Comision): void {
    const modalRef = this.dialog.open(ComisionViewComponent, {
      width: '50%',
      data: { comision: comision }
    });
    modalRef.afterClosed().subscribe(data => {
      
    });
  }

  public mostrarTurno(turno: number) {
    if (turno === 1) return 'Mañana';
    if (turno === 2) return 'Tarde';
    if (turno === 3) return 'Noche';
  }

  public search() {
    this.loading = true;
    this.comisionService.search(this.comisionFiltrosDTO).subscribe(data => {
      this.comisiones = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public cleanFilter() {
    this.comisionFiltrosDTO = new ComisionFiltrosDTO();
    this.formulario.controls['numeroComision'].setValue('');
    this.formulario.controls['carrera'].setValue(null);
    this.ngOnInit();
  }

  public agregarComision() {
    const modalRef = this.dialog.open(ComisionAddComponent, {
      width: '50%'
    });
    modalRef.afterClosed().subscribe(data => {});
  }

  public eliminarComision(comision: Comision): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea eliminar la comision ${comision.numeroComision}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.comisionService.eliminarComision(comision.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', 'Comision eliminada con exito!', 'success');
        });
      }
    });
  }

  public asignarAula(comision: Comision) {
    const modalRef = this.dialog.open(AsignarAulaComponent, {
      width: '50%',
      data: { comision: comision }
    });
    modalRef.afterClosed().subscribe(data => {});
  }

  public editarComision(comision: Comision) {
    const modalRef = this.dialog.open(ComisionEditComponent, {
      width: '50%',
      data: { comision: comision }
    });
    modalRef.afterClosed().subscribe(data => {});
  }
}
