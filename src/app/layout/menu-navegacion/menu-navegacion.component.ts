import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AsignarComisionAsignaturaComponent } from 'src/app/components/docente/asignar-comision-asignatura/asignar-comision-asignatura.component';

@Component({
  selector: 'app-menu-navegacion',
  templateUrl: './menu-navegacion.component.html',
  styleUrls: ['./menu-navegacion.component.css']
})
export class MenuNavegacionComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  public asignarAsignatura() {
    const modalRef = this.dialog.open(AsignarComisionAsignaturaComponent, {
      width: '50%',
      data: { docente: null }
    });
    modalRef.afterClosed().subscribe(data => {
      
    });
  }

}
