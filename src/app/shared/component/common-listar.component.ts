import { OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Generic } from 'src/app/models/generic';
import { CommonService } from '../service/common.service';

export abstract class CommonListarComponent<E extends Generic, S extends CommonService<E>> implements OnInit {

  titulo: string = '';
  lista: E[] = [];
  dataSource: MatTableDataSource<E>;
  protected nombreModel: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  constructor(protected service: S) { }

  ngOnInit() {
    this.service.listar().subscribe(data => {
      this.lista = data;
      this.iniciarPaginador();
    });
  }

  iniciarPaginador() {
    this.dataSource = new MatTableDataSource<E>(this.lista);
    this.dataSource.paginator = this.paginator;
    this.paginator._intl.itemsPerPageLabel = 'Registros por pagina';
  }


}
