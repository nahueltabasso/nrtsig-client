import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asignatura, AsignaturaCorrelativa } from 'src/app/models/carrera.models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-asignatura-view',
  templateUrl: './asignatura-view.component.html',
  styleUrls: ['./asignatura-view.component.css']
})
export class AsignaturaViewComponent implements OnInit {

  titulo: string;
  asignatura: Asignatura;
  formulario: FormGroup;
  expansionPanel = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<AsignaturaViewComponent>,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.createForm();
    this.asignatura = this.data.asignatura as Asignatura;
    this.titulo = this.asignatura.nombre.toUpperCase();
    this.loadData();
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: [{value: '', disabled: true}],
      createAt: [{value: '', disabled: true}],
      descripcion: [{value: '', disabled: true}],
      carrera: [{value: '', disabled: true}],
      nivel: [{value: '', disabled: true}],
      tipoAsignatura: [{value: '', disabled: true}]
    });
  }

  public loadData() {
    this.formulario.controls['nombre'].setValue(this.asignatura.nombre);
    this.formulario.controls['createAt'].setValue(this.transformDate(this.asignatura.createAt));
    this.formulario.controls['descripcion'].setValue(this.asignatura.descripcion);
    this.formulario.controls['carrera'].setValue(this.asignatura.planCarrera.carrera.nombre);
    this.formulario.controls['nivel'].setValue(this.asignatura.nivel);
    if (this.asignatura.tipoAsignatura === 1) {
      this.formulario.controls['tipoAsignatura'].setValue('Obligatoria');
    } else {
      this.formulario.controls['tipoAsignatura'].setValue('Electiva');
    }
  }

  drop(event: CdkDragDrop<AsignaturaCorrelativa[]>) {
    moveItemInArray(this.asignatura.asignaturasHijas, event.previousIndex, event.currentIndex);
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }
}
