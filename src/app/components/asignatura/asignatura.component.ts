import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Asignatura, AsignaturaFiltrosDTO, Carrera } from 'src/app/models/carrera.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { LABEL_PAGINADOR, PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { AsignaturaViewComponent } from './asignatura-view/asignatura-view.component';

@Component({
  selector: 'app-asignatura',
  templateUrl: './asignatura.component.html',
  styleUrls: ['./asignatura.component.css']
})
export class AsignaturaComponent implements OnInit {

  titulo: string = 'LISTADO DE ASIGNATURAS';
  asignaturas: Asignatura[] = [];
  dataSource: MatTableDataSource<Asignatura>;
  displayedColumns: string[] = ['id', 'nombre', 'tipoAsignatura', 'nivel', 'cantidadCorrelativas', 'nombreCarrera', 'plan', 'acciones']
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  comboCarrera: Carrera[] = [];
  asignaturaFiltrosDTO: AsignaturaFiltrosDTO = new AsignaturaFiltrosDTO();

  constructor(private asignaturaService: AsignaturaService,
              private carreraService: CarreraService,
              private fb: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.loading = true;
    this.asignaturaService.listarAsignaturas().subscribe(data => {
      this.asignaturas = data;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.carreraService.listar().subscribe(carreras => {
      this.comboCarrera = carreras;
    });
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombreAsignatura: ['', ],
      nivel: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER), Validators.max(6), Validators.min(1)])],
      carrera: ['', ],
    });
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Asignatura>(this.asignaturas);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNombreAsignatura() {
    this.asignaturaFiltrosDTO.nombre = this.formulario.controls['nombreAsignatura'].value;
  }

  public onChangeNivel() {
    this.asignaturaFiltrosDTO.nivel = this.formulario.controls['nivel'].value;
  }

  public seleccionarCarrera(event) {
    this.asignaturaFiltrosDTO.carrera = event;
  }

  public search() {
    this.loading = true;
    this.asignaturaService.search(this.asignaturaFiltrosDTO).subscribe(data => {
      this.asignaturas = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public mostrarTipoAsignatura(tipoAsignatura: number) {
    if (tipoAsignatura === 1) {
      return 'Obligatoria';
    }
    return 'Electiva';
  }

  public cleanFilter() {
    this.asignaturaFiltrosDTO = new AsignaturaFiltrosDTO();
    this.formulario.controls['nombreAsignatura'].setValue('');
    this.formulario.controls['nivel'].setValue('');
    this.formulario.controls['carrera'].setValue(null);
    this.formulario.reset();
    this.ngOnInit();
  }

  public verAsignatura(asignatura: Asignatura) {
    const modalRef = this.dialog.open(AsignaturaViewComponent, {
      width: '50%',
      data: { asignatura: asignatura }
    });
    modalRef.afterClosed().subscribe(data => {});
  }

  public calcularCantidadCorrelativas(asignatura: Asignatura) {
    if (asignatura.asignaturasHijas.length === 0) {
      return ' - ';
    }
    return asignatura.asignaturasHijas.length;
  }

  public eliminarAsignatura(asignatura: Asignatura): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea eliminar la asignatura: ${asignatura.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.asignaturaService.eliminarAsignatura(asignatura.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', 'Asignatura eliminada con exito!', 'success');
        });
      }
    });
  }

}
