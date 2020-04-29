import { Component, OnInit, ViewChild } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno.models';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoViewComponent } from './alumno-view/alumno-view.component';

@Component({
  selector: 'app-alumno',
  templateUrl: './alumno.component.html'
})
export class AlumnoComponent implements OnInit {

  titulo: string = 'LISTADO DE ALUMNO';
  alumnos: Alumno[] = [];
  dataSource: MatTableDataSource<Alumno>;
  autoCompleteControl = new FormControl();
  displayedColumns: string[] = ['legajo', 'apellido', 'nombre', 'tipoDocumento', 'nroDocumento', 'fechaNacimiento', 'acciones'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(private alumnoService: AlumnoService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.alumnoService.listar().subscribe(data => {
      this.alumnos = data;
      this.iniciarPaginador();
    });
  }

  iniciarPaginador() {
    this.dataSource = new MatTableDataSource<Alumno>(this.alumnos);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }

  verAlumno(alumno: Alumno): void {
    const modalRef = this.dialog.open(AlumnoViewComponent, { 
      width: '750px',
      data: { alumno: alumno }
     });

     modalRef.afterClosed().subscribe(data => {
       this.ngOnInit();
     })
  }

}
