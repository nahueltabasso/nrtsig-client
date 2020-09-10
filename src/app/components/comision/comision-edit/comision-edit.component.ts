import { Component, OnInit, Inject } from '@angular/core';
import { Comision, Aula } from 'src/app/models/carrera.models';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComisionService } from 'src/app/services/comision.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import { AsignarAulaComponent } from '../asignar-aula/asignar-aula.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comision-edit',
  templateUrl: './comision-edit.component.html',
  styleUrls: ['./comision-edit.component.css']
})
export class ComisionEditComponent implements OnInit {

  titulo: string;
  comision: Comision = new Comision();
  displayedColumnsAula: string[] = ['id', 'numeroSalon', 'fechaAlta', 'nroComision', 'acciones'];
  aulaDataSource: Aula[] = [];
  flagAsignarAulaButton: boolean = false;
  formulario: FormGroup;
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private comisionService: ComisionService,
              private matDialog: MatDialog,
              public dialog: MatDialogRef<ComisionEditComponent>) { }

  ngOnInit(): void {
    this.createForm();
    this.comision = this.data.comision as Comision;
    this.loadData();
    this.cargarDataSourceAula();
  }

  public createForm() {
    this.formulario = this.fb.group({
      numeroComision: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      capacidadMaxima: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      carrera: ['', Validators.required]
    });
  }

  public loadData() {
    this.formulario.controls['numeroComision'].setValue(this.comision.numeroComision);
    this.formulario.controls['capacidadMaxima'].setValue(this.comision.capacidadMaxima);
    this.formulario.controls['carrera'].setValue(this.comision.planCarrera.carrera.nombre);
    this.formulario.controls['numeroComision'].disable();
    this.formulario.controls['carrera'].disable();
    this.titulo = 'COMISION ' + this.comision.numeroComision + " - " + this.comision.planCarrera.carrera.nombre
  }

  public onChangeCapacidad() {
    this.comision.capacidadMaxima = this.formulario.controls['capacidadMaxima'].value;
  }

  public save() {
    // Si pasa la validacion
    console.log(this.comision);
    this.comisionService.actualizarComision(this.comision).subscribe(d => {
      this.comision = d;
      this.formulario.controls['numeroComision'].disable();
      this.formulario.controls['capacidadMaxima'].disable();
      this.formulario.controls['carrera'].disable();
      this.flagAsignarAulaButton = true ;
    });
  }

  public asignarAula() {
    const modalRef = this.matDialog.open(AsignarAulaComponent, {
      width: '50%',
      data: { comision: this.comision }
    });
    modalRef.afterClosed().subscribe(data => {
      this.cargarDataSourceAula();
    });
  }

  private cargarDataSourceAula() {
    this.comisionService.getAulasByComision(this.comision.id).subscribe(d => {
      this.aulaDataSource = d;
    });
  }

  public liberarAula(aula: Aula) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea liberar el aula numero ${aula.numeroSalon}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Liberar!'
    }).then((result) => {
      this.comisionService.liberarAula(aula).subscribe(data => {
        Swal.fire('Liberado', 'Aula liberada!', 'success');
        this.cargarDataSourceAula();
      });
    });
  }

  public close() {
    this.dialog.close();
  }
}
