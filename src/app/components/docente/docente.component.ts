import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Carrera, Departamento, Docente, DocenteFiltrosDTO } from 'src/app/models/carrera.models';
import { CarreraService } from 'src/app/services/carrera.service';
import { DocenteService } from 'src/app/services/docente.service';
import { LABEL_PAGINADOR, PATTERN_ONLYLETTERS } from 'src/app/shared/constants';
import { AsignarComisionAsignaturaComponent } from './asignar-comision-asignatura/asignar-comision-asignatura.component';

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.css']
})
export class DocenteComponent implements OnInit {

  titulo: string = 'LISTADO DE DOCENTES';
  docentes: Docente[] = [];
  dataSource: MatTableDataSource<Docente>;
  displayedColumns: string[] = ['legajo', 'nombre', 'apellido', 'createAt', 'cuit', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  docenteFiltrosDTO: DocenteFiltrosDTO = new DocenteFiltrosDTO();
  comboDepartamento: Departamento[] = [];
  comboCarrera: Carrera[] = [];
  comboAsignatura: string[] = ['Analisis Matematico I', 'Fisica I', 'Matematicas Discretas'];
  
  constructor(private docenteService: DocenteService,
              private carreraService: CarreraService,
              private fb: FormBuilder,
              public dialog: MatDialog) { }

  ngOnInit(): void {
    this.createForm();
    this.loading = true;
    this.docenteService.listarDocentes().subscribe(data => {
      this.docentes = data;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.carreraService.listarDepartamentos().subscribe(dptos => {
      this.comboDepartamento = dptos;
    });
    this.formulario.controls['nombre'].setValue('');
    this.formulario.controls['departamento'].setValue(null);
    this.formulario.controls['carrera'].setValue(null);
    this.formulario.controls['asignatura'].setValue(null);
    this.formulario.controls['carrera'].disable();
    this.formulario.controls['asignatura'].disable();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])],
      departamento: ['', ],
      carrera: ['', ],
      asignatura: ['', ]
    });
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Docente>(this.docentes);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNombreDocente() {
    this.docenteFiltrosDTO.nombre = this.formulario.controls['nombre'].value;
  }

  public seleccionarDepartamento(event) {
    this.docenteFiltrosDTO.departamento = event;
    this.carreraService.getCarrerasByDepartamento(this.docenteFiltrosDTO.departamento.id).subscribe(data => {
      this.comboCarrera = data;
      this.formulario.controls['carrera'].enable();
    });
  }

  public seleccionarCarrera(event) {
    this.docenteFiltrosDTO.carrera = event;
    // Llamada al servicio de asignatura cuando se implemente
    this.formulario.controls['asignatura'].enable();
  }

  public seleccionarAsignatura(event) {
    this.docenteFiltrosDTO.asignatura = event;
  }

  public search() {
    if (this.formulario.invalid) return;
    this.loading = true;
    this.docenteService.search(this.docenteFiltrosDTO).subscribe(data => {
      this.docentes = data;
      this.iniciarPaginador();
      this.loading = false;
    });    
  }

  public cleanFilter() {
    this.docenteFiltrosDTO = new DocenteFiltrosDTO();
    this.formulario.reset();
    this.formulario.controls['nombre'].setValue('');
    this.formulario.controls['departamento'].setValue(null);
    this.formulario.controls['carrera'].setValue(null);
    this.formulario.controls['asignatura'].setValue(null);
    this.formulario.controls['carrera'].disable();
    this.formulario.controls['asignatura'].disable();
    this.ngOnInit();
  }

  public openAsignarAsignaturaComision(docente: Docente) {
    const modalRef = this.dialog.open(AsignarComisionAsignaturaComponent, {
      width: '50%',
      data: { docente: docente }
    });
    modalRef.afterClosed().subscribe(data => {
      
    });
  }
}
