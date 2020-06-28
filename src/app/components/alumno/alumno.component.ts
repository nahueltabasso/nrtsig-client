import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno.models';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoViewComponent } from './alumno-view/alumno-view.component';
import Swal from 'sweetalert2';
import { PATTERN_ONLYLETTERS, LABEL_PAGINADOR } from 'src/app/shared/constants';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html'
})
export class AlumnoComponent implements OnInit {

  titulo: string = 'LISTADO DE ALUMNOS';
  alumnos: Alumno[] = [];
  dataSource: MatTableDataSource<Alumno>;
  autoCompleteControl = new FormControl();
  displayedColumns: string[] = ['legajo', 'apellido', 'nombre', 'tipoDocumento', 'nroDocumento', 'fechaNacimiento', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  loading = false;
  formulario: FormGroup;
  filter: string = '';

  constructor(private alumnoService: AlumnoService,
              public dialog: MatDialog,
              private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.loading = true;
    this.alumnoService.listar().subscribe(data => {
      this.alumnos = data;
      this.iniciarPaginador();
      this.loading = false;
    });
  }

  public createForm() {
    this.formulario = this.fb.group({
      buscar: [null, Validators.compose([Validators.pattern(PATTERN_ONLYLETTERS)])]
    })
  }

  public iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = LABEL_PAGINADOR;
  }

  public verAlumno(alumno: Alumno): void {
    const modalRef = this.dialog.open(AlumnoViewComponent, { 
      width: '1000px',
      data: { alumno: alumno }
     });

     modalRef.afterClosed().subscribe(data => {
       this.ngOnInit();
     });
  }

  public onChangeBuscarAlumno(): void {
    this.filter = this.formulario.controls['buscar'].value;
  }

  public search() {
    if (this.filter !== ''){
      this.alumnoService.search(this.filter).subscribe(data => {
        this.alumnos = data;
        this.iniciarPaginador();
      });  
    } else {
      this.alumnoService.listar().subscribe(data => {
        this.alumnos = data;
        this.iniciarPaginador();
        this.loading = false;  
      }); 
    }
  }

  public cleanFilter() {
    this.filter = '';
    this.formulario.controls['buscar'].setValue('');
    this.ngOnInit();
  }

  public eliminarAlumno(alumno: Alumno): void {
    Swal.fire({
      title: 'Estas seguro?',
      text: `Seguro que desea eliminar a ${alumno.nombre} ${alumno.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Eliminar!'
    }).then((result) => {
      if (result.value) {
        this.alumnoService.eliminar(alumno.id).subscribe(() => {
          this.ngOnInit();
          Swal.fire('Eliminado', `Alumno ${alumno.nombre} ${alumno.apellido} eliminado con exito`, 'success');
        });
      }
    });
  }

}
