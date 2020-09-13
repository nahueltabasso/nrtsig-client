import { Component, OnInit, ViewChild } from '@angular/core';
import { Carrera, CarreraFiltrosDTO, TipoCarrera, Departamento } from 'src/app/models/carrera.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CarreraService } from 'src/app/services/carrera.service';
import { MatDialog } from '@angular/material/dialog';
import { PATTERN_ONLYLETTERS, PATTERN_ONLYNUMBER, LABEL_PAGINADOR } from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { CarreraViewComponent } from './carrera-view/carrera-view.component';

@Component({
  selector: 'app-carrera',
  templateUrl: './carrera.component.html',
  styleUrls: ['./carrera.component.css']
})
export class CarreraComponent implements OnInit {

  titulo: string = 'LISTADO DE CARRERAS';
  carreras: Carrera[] = [];
  dataSource: MatTableDataSource<Carrera>;
  displayedColumns: string[] = ['id', 'nombreCorto', 'duracion', 'fechaAlta', 'estado', 'tipoCarrera', 'departamento', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  carreraFiltrosDTO: CarreraFiltrosDTO = new CarreraFiltrosDTO();
  comboTipoCarrera: TipoCarrera[] = [];
  comboDepartamento: Departamento[] = [];

  constructor(private carreraService: CarreraService,
              public dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.loading = true;
    this.carreraService.listar().subscribe(data => {
      this.carreras = data;
      this.iniciarPaginador();
      this.loading = false;
    });
    this.carreraService.listarTipoCarrera().subscribe(data1 => {
      this.comboTipoCarrera = data1;
    });
    this.carreraService.listarDepartamentos().subscribe(data2 => {
      this.comboDepartamento = data2;
    });
    this.formulario.controls['nombre'].setValue('');
    this.formulario.controls['duracion'].setValue('');
    this.formulario.controls['tipoCarrera'].setValue(null);
    this.formulario.controls['departamento'].setValue(null);
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])],
      duracion: ['', Validators.compose([Validators.pattern(PATTERN_ONLYNUMBER)])],
      tipoCarrera: ['', ],
      departamento: ['', ]
    });
    // this.formulario.valueChanges.subscribe(value => {
    //   this.carreraFiltrosDTO.nombre = value.nombre;
    //   this.carreraFiltrosDTO.duracion = value.duracion;
    // })
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Carrera>(this.carreras);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public onChangeNombreCarrera() {
    this.carreraFiltrosDTO.nombre = this.formulario.controls['nombre'].value;
  }

  public onChangeDuracionCarrera() {
    this.carreraFiltrosDTO.duracion = this.formulario.controls['duracion'].value;
  }

  public seleccionarTipoCarrera(event): void {
    this.carreraFiltrosDTO.tipoCarrera = event;
  }

  public seleccionarDepartamento(event): void {
    this.carreraFiltrosDTO.departamento = event;
  }

  public seleccionarEstadoCarrera(event): void {
    this.carreraFiltrosDTO.estadoCarrera = event;
  }

  public verCarrera(carrera: Carrera): void {
    const modalRef = this.dialog.open(CarreraViewComponent, {
      width: '50%',
      data: { carrera: carrera }
    });
    modalRef.afterClosed().subscribe(data => {
      this.ngOnInit();
    });
  }
  
  public search() {
    this.loading = true;
    this.carreraService.search(this.carreraFiltrosDTO).subscribe(data => {
      this.carreras = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public cleanFilter() {
    this.carreraFiltrosDTO = new CarreraFiltrosDTO();
    this.formulario.controls['nombre'].setValue('');
    this.formulario.controls['duracion'].setValue('');
    this.formulario.controls['tipoCarrera'].setValue(null);
    this.formulario.controls['departamento'].setValue(null);
    this.formulario.reset();
    this.ngOnInit();
  }

  public eliminarCarrera(carrera: Carrera): void {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea eliminar la carrera de ${carrera.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.carreraService.eliminarCarrera(carrera.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', 'Carrera eliminada con exito!', 'success');
        });
      }
    });
  }

}
