import { Component, OnInit, ViewChild } from '@angular/core';
import { InscripcionCarrera, InscripcionCarreraFiltrosDTO, EstadoInscripcion } from 'src/app/models/inscripcion.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Departamento, EstadoCarrera } from 'src/app/models/carrera.models';
import { InscripcionCarreraService } from 'src/app/services/inscripcion-carrera.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { MatDialog } from '@angular/material/dialog';
import { PATTERN_ONLYLETTERS, PATTERN_ONLYNUMBER, LABEL_PAGINADOR, MIN_ASIGNATURAS, MAX_ASIGNATURAS } from 'src/app/shared/constants';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import Swal from 'sweetalert2';
import { InscripcionCarreraViewComponent } from './inscripcion-carrera-view/inscripcion-carrera-view.component';

@Component({
  selector: 'app-inscripcion-carrera',
  templateUrl: './inscripcion-carrera.component.html',
  styleUrls: ['./inscripcion-carrera.component.css']
})
export class InscripcionCarreraComponent implements OnInit {

  titulo: string = 'LISTADO DE INSCRIPCIONES CARRERA';
  inscripcionesCarrera: InscripcionCarrera[] = [];
  dataSource: MatTableDataSource<InscripcionCarrera>;
  displayedColumns: string[] = ['id', 'fechaInscripcion', 'fechaEgreso', 'nombreAlumno', 'estadoCarrera', 'estadoInscripcion', 'anioPlan', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading: boolean = false;
  formulario: FormGroup;
  inscripcionCarreraFiltrosDTO: InscripcionCarreraFiltrosDTO = new InscripcionCarreraFiltrosDTO();
  comboDepartamento: Departamento[] = [];
  comboEstadoCarrera: EstadoCarrera[] = [];
  comboEstadoInscripcion: EstadoInscripcion[] = [];

  constructor(private inscripcionCarreraService: InscripcionCarreraService,
              private carreraService: CarreraService,
              private dialog: MatDialog,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.titulo.toUpperCase();
    this.createForm();
    this.carreraService.listarDepartamentos().subscribe(data => {
      this.comboDepartamento = data;
    });
    this. inscripcionCarreraService.listarEstadoCarrera().subscribe(estadosCarrera => {
      this.comboEstadoCarrera = estadosCarrera;
    });
    this.inscripcionCarreraService.listarEstadoInscripcion().subscribe(estadosInscripcion => {
      this.comboEstadoInscripcion = estadosInscripcion;
    });
    this.loading = true;
    this.inscripcionCarreraService.listar().subscribe(list => {
      this.inscripcionesCarrera = list;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.formulario.controls['fechaDesde'].setValue(this.transformDate(new Date()));
    this.formulario.controls['fechaHasta'].setValue(this.transformDate(new Date()));
    this.formulario.controls['asignaturaDesde'].setValue(MIN_ASIGNATURAS);
    this.formulario.controls['asignaturaHasta'].setValue(MAX_ASIGNATURAS);
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobDesde = MIN_ASIGNATURAS;
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobHasta = MAX_ASIGNATURAS;
    this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde = new Date();
    this.inscripcionCarreraFiltrosDTO.fechaInscripcionHasta = new Date();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombreCarrera: ['', Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])],
      estadoCarrera: ['', ],
      estadoInscripcion: ['', ],
      asignaturaDesde: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(2)])],
      asignaturaHasta: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(2), this.validatorAsignaturaHasta.bind(this)])],
      departamento: ['', ],
      fechaDesde: [new Date(), ],
      fechaDesdePicker: ['', ],
      fechaHasta: [new Date(), this.lastDateValidator.bind(this)],
      fechaHastaPicker: ['', ],
      nombreAlumno: ['', Validators.pattern(PATTERN_ONLYLETTERS)],
      apellidoAlumno: ['', Validators.pattern(PATTERN_ONLYLETTERS)]
    });
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<InscripcionCarrera>(this.inscripcionesCarrera);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNombreCarrera() {
    this.inscripcionCarreraFiltrosDTO.nombreCarrera = this.formulario.controls['nombreCarrera'].value;
  }

  public seleccionarEstadoCarrera(event) {
    this.inscripcionCarreraFiltrosDTO.estadoCarrera = event;
  }

  public seleccionarEstadoInscripcion(event) {
    this.inscripcionCarreraFiltrosDTO.estadoInscripcion = event;
  }

  public seleccionarDepartamento(event) {
    this.inscripcionCarreraFiltrosDTO.departamento = event;
  }

  public onChangeAsignaturaDesde() {
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobDesde = this.formulario.controls['asignaturaDesde'].value;
  }

  public onChangeAsignaturaHasta() {
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobHasta = this.formulario.controls['asignaturaHasta'].value;
  }

  public onChangeNombreAlumno() {
    this.inscripcionCarreraFiltrosDTO.nombreAlumno = this.formulario.controls['nombreAlumno'].value;
  }

  public onChangeApellidoAlumno() {
    this.inscripcionCarreraFiltrosDTO.apellidoAlumno = this.formulario.controls['apellidoAlumno'].value;
  }

  public selectFechaDesde(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formulario.controls['fechaDesde'].setValue(date);
      this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde = event.value;
    } else {
      const from = this.formulario.get('fechaDesde').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1; 
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formulario.controls['fechaDesdePicker'].setValue(date);
      this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde = date;
    }
  }

  selectFechaHasta(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formulario.controls['fechaHasta'].setValue(date);
      this.inscripcionCarreraFiltrosDTO.fechaInscripcionHasta = event.value;
    } else {
      const from = this.formulario.get('fechaHasta').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1;
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formulario.controls['fechaHastaPicker'].setValue(date);
      if (date >= this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde) {
        this.inscripcionCarreraFiltrosDTO.fechaInscripcionHasta = date;
      }
    }
  }

  transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  lastDateValidator() {
    try {
      const fechaDesde = this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde;
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
    const date = this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde;
    // se puede seleccionar dias desde hoy para adelante
    return d >= date;
  }

  public validatorAsignaturaHasta() {
    try {
      const asignaturaDesde = Number(this.formulario.get('asignaturaDesde').value);
      const asignaturaHasta = Number(this.formulario.get('asignaturaHasta').value);
      if (asignaturaHasta < asignaturaDesde) {
        return { validatorAsignaturaHasta: true};
      } else {
        return {};
      }
    } catch (e) {
      return { validatorAsignaturaHasta: false };
    }
  }

  
  public cleanFilter() {
    this.inscripcionCarreraFiltrosDTO = new InscripcionCarreraFiltrosDTO();
    this.formulario.reset();
    this.formulario.controls['fechaDesde'].setValue(this.transformDate(new Date()));
    this.formulario.controls['fechaHasta'].setValue(this.transformDate(new Date()));
    this.formulario.controls['asignaturaDesde'].setValue(MIN_ASIGNATURAS);
    this.formulario.controls['asignaturaHasta'].setValue(MAX_ASIGNATURAS);
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobDesde = MIN_ASIGNATURAS;
    this.inscripcionCarreraFiltrosDTO.cantAsignaturasAprobHasta = MAX_ASIGNATURAS;
    this.inscripcionCarreraFiltrosDTO.fechaInscripcionDesde = new Date();
    this.inscripcionCarreraFiltrosDTO.fechaInscripcionHasta = new Date();
    this.ngOnInit();
  }

  public search() {
    this.loading = true;
    this.inscripcionCarreraService.search(this.inscripcionCarreraFiltrosDTO).subscribe(data => {
      this.inscripcionesCarrera = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public eliminarInscripcionCarrera(inscripcion: InscripcionCarrera): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea eliminar la Inscripcion numero ${inscripcion.id}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.inscripcionCarreraService.eliminarInscripcion(inscripcion.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', 'Inscripcion eliminada con exito!', 'success');
        });
      }
    });
  }

  public verInscripcion(inscripcion: InscripcionCarrera): void {
    const modalRef = this.dialog.open(InscripcionCarreraViewComponent, {
      width: '80%',
      data: { inscripcionCarrera: inscripcion }
    });
    modalRef.afterClosed().subscribe(data => {
      //
    });
  }

}
