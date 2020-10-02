import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Asignatura, AsignaturaCorrelativa } from 'src/app/models/carrera.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura-edit',
  templateUrl: './asignatura-edit.component.html',
  styleUrls: ['./asignatura-edit.component.css']
})
export class AsignaturaEditComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  asignatura: Asignatura;

  constructor(private asignaturaService: AsignaturaService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.createForm();
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = Number(params.get('id'));
      this.asignaturaService.getAsignaturaById(id).subscribe(data => {
        this.asignatura = data;
        this.titulo = `ASIGNATURA: ${this.asignatura.nombre}`;
        this.titulo.toUpperCase();
        this.loadData();
      });
    })
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.compose([Validators.required])],
      descripcion: ['', ],
      nivel: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.max(6), Validators.min(1)])],
      carrera: ['', Validators.compose([Validators.required])],
      tipoAsignatura: ['', Validators.compose([Validators.required])]
    });
  }

  public loadData() {
    this.formulario.controls['nombre'].setValue(this.asignatura.nombre);
    this.formulario.controls['descripcion'].setValue(this.asignatura.descripcion);
    this.formulario.controls['carrera'].setValue(this.asignatura.planCarrera.carrera.nombre);
    this.formulario.controls['nivel'].setValue(this.asignatura.nivel);
    if (this.asignatura.tipoAsignatura === 1) {
      this.formulario.controls['tipoAsignatura'].setValue("Obligatoria");
    } else {
      this.formulario.controls['tipoAsignatura'].setValue("Electiva");
    }
    // Deshabilitamos los campos que no se pueden modificar
    this.deshabilitarCampos();
  }

  public deshabilitarCampos() {
    this.formulario.controls['nombre'].disable();
    this.formulario.controls['nivel'].disable();
    this.formulario.controls['carrera'].disable();
    this.formulario.controls['tipoAsignatura'].disable();
  }

  public onChangeDescripcion() {
    this.asignatura.descripcion = this.formulario.controls['descripcion'].value;
  }

  drop(event: CdkDragDrop<AsignaturaCorrelativa[]>) {
    moveItemInArray(this.asignatura.asignaturasHijas, event.previousIndex, event.currentIndex);
  }

  public save() {
    this.asignaturaService.actualizarAsignatura(this.asignatura.id, this.asignatura.descripcion).subscribe(data => {
      Swal.fire('Nuevo', `Asignatura actualizada con exito`, 'success');
      this.router.navigate(['/asignatura']);
    });
  }

}
