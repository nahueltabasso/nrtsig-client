import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Carrera, EstadoAsignatura } from 'src/app/models/carrera.models';
import { InscripcionAsignatura, InscripcionAsignaturaFiltrosDTO } from 'src/app/models/inscripcion.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { LABEL_PAGINADOR, PATTERN_ONLYLETTERS } from 'src/app/shared/constants';
import { InscripcionViewComponent } from '../inscripcion-view/inscripcion-view.component';

@Component({
  selector: 'app-inscripcion-list',
  templateUrl: './inscripcion-list.component.html',
  styleUrls: ['./inscripcion-list.component.css']
})
export class InscripcionListComponent implements OnInit {

  titulo: string = 'LISTADO DE INSCRIPCIONES';
  inscripciones: InscripcionAsignatura[] = [];
  dataSource: MatTableDataSource<InscripcionAsignatura>;
  displayedColumns: string[] = ['asignatura', 'alumno', 'comision', 'carrera', 'estado', 'fechaInscripcion', 'nota', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  inscripcionFiltrosDTO: InscripcionAsignaturaFiltrosDTO = new InscripcionAsignaturaFiltrosDTO();
  comboCarrera: Carrera[] = [];
  comboEstados: EstadoAsignatura[] = [];

  constructor(private carreraService: CarreraService,
              private asignaturaService: AsignaturaService,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.titulo.toUpperCase();
    this.createForm();
    this.loading = true;
    this.asignaturaService.listarInscripciones().subscribe(inscrip => {
      this.inscripciones = inscrip;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.carreraService.listar().subscribe(data => {
      this.comboCarrera = data;
    });
    this.asignaturaService.listarEstadosInscripcion().subscribe(estados => {
      this.comboEstados = estados;
    });
    this.formulario.controls['fechaDesde'].setValue(this.transformDate(new Date()));
    this.formulario.controls['fechaHasta'].setValue(this.transformDate(new Date()));
    this.inscripcionFiltrosDTO.fechaInscripcionDesde = new Date();
    this.inscripcionFiltrosDTO.fechaInscripcionHasta = new Date();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombreAlumno: ['', Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])],
      nombreAsignatura: ['', ],
      estado: ['', Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])],
      carrera: ['', ],
      fechaDesde: [new Date(), ],
      fechaDesdePicker: ['', ],
      fechaHasta: [new Date(), this.lastDateValidator.bind(this)],
      fechaHastaPicker: ['', ],
    })
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<InscripcionAsignatura>(this.inscripciones);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNombreAlumno() {
    this.inscripcionFiltrosDTO.nombreAlumno = this.formulario.controls['nombreAlumno'].value;
  }

  public onChangeNombreAsignatura() {
    this.inscripcionFiltrosDTO.nombreAsignatura = this.formulario.controls['nombreAsignatura'].value;
  }

  public seleccionarCarrera(event) {
    this.inscripcionFiltrosDTO.carrera = event;
  }

  public seleccionarEstado(event) {
    this.inscripcionFiltrosDTO.estadoAsignatura = event;
  }

  public selectFechaDesde(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formulario.controls['fechaDesde'].setValue(date);
      this.inscripcionFiltrosDTO.fechaInscripcionDesde = event.value;
    } else {
      const from = this.formulario.get('fechaDesde').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1; 
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formulario.controls['fechaDesdePicker'].setValue(date);
      this.inscripcionFiltrosDTO.fechaInscripcionDesde = date;
    }
  }

  public selectFechaHasta(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formulario.controls['fechaHasta'].setValue(date);
      this.inscripcionFiltrosDTO.fechaInscripcionHasta = event.value;
    } else {
      const from = this.formulario.get('fechaHasta').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1;
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formulario.controls['fechaHastaPicker'].setValue(date);
      if (date >= this.inscripcionFiltrosDTO.fechaInscripcionDesde) {
        this.inscripcionFiltrosDTO.fechaInscripcionHasta = date;
      }
    }
  }

  public lastDateValidator() {
    try {
      const fechaDesde = this.inscripcionFiltrosDTO.fechaInscripcionDesde;
      const fechaHasta = this.formulario.get('fechaHasta').value.split('/');
      const year = Number(fechaHasta[2]);
      const month = Number(fechaHasta[1]) - 1;
      const day = Number(fechaHasta[0]);
      const fechaHastaDate = new Date(year, month, day);
      fechaHastaDate.setDate(fechaHastaDate.getDate() + 1);
      if (fechaHastaDate < fechaDesde) {
        return {
          lastDateValidator: true
        }; } else {
          return {};
        }
    } catch (e) {
      return {
        lastDateValidator: false
      };
    }
  }

  myFilterDate = (d: Date): boolean => {
    const date = this.inscripcionFiltrosDTO.fechaInscripcionDesde;
    // se puede seleccionar dias desde hoy para adelante
    return d >= date;
  }

  public search() {
    this.loading = true;
    this.asignaturaService.searchInscripciones(this.inscripcionFiltrosDTO).subscribe(data => {
      this.inscripciones = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public cleanFilter() {
    this.inscripcionFiltrosDTO = new InscripcionAsignaturaFiltrosDTO();
    this.formulario.reset();
    this.formulario.controls['fechaDesde'].setValue(this.transformDate(new Date()));
    this.formulario.controls['fechaHasta'].setValue(this.transformDate(new Date()));
    this.inscripcionFiltrosDTO.fechaInscripcionDesde = new Date();
    this.inscripcionFiltrosDTO.fechaInscripcionHasta = new Date();
    this.ngOnInit();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public verInscripcion(inscripcion: InscripcionAsignatura): void {
    const modalRef = this.dialog.open(InscripcionViewComponent, {
      width: '80%',
      data: { inscripcion: inscripcion }
    });
    modalRef.afterClosed().subscribe(data => {
      //
    });
  }
}
