import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Docente } from 'src/app/models/carrera.models';
import { DocenteService } from 'src/app/services/docente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docente-edit',
  templateUrl: './docente-edit.component.html',
  styleUrls: ['./docente-edit.component.css']
})
export class DocenteEditComponent implements OnInit {

  titulo: string;
  docente: Docente = new Docente();
  formulario: FormGroup;
  flagDocenteExist: boolean = false;

  constructor(private docenteService: DocenteService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = Number (params.get('id'));
      this.docenteService.getById(id).subscribe(data => {
        this.docente = data;
        // Validamos que el docente exista para definir si mostramos o no
        // un mensaje de error
        if (this.docente != null && this.docente != undefined) {
          this.flagDocenteExist = false;
          this.titulo = 'DOCENTE: ' + this.docente.apellido.toUpperCase() + ', ' + this.docente.nombre.toUpperCase();
          this.createForm();
          this.loadDataDocente();
        } else {
          this.flagDocenteExist = true;
        }
      });
    });
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: [{value: '', disabled: true}],
      apellido: [{value: '', disabled: true}],
      genero: [{value: '', disabled: true}],
      tipoDocumento: [{value: '', disabled: true}],
      numeroDocumento: [{value: '', disabled: true}],
      cuit: [{value: '', disabled: true}],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      legajo: [{value: '', disabled:true}],
      createAt: [{value: '', disabled:true}]
    });
  }

  public loadDataDocente() {
    // CARGA DE DATOS DEL DOCENTE
    this.formulario.controls['nombre'].setValue(this.docente.nombre);
    this.formulario.controls['apellido'].setValue(this.docente.apellido);
    this.formulario.controls['genero'].setValue(this.docente.sexo);
    this.formulario.controls['genero'].disable();
    this.formulario.controls['tipoDocumento'].setValue(this.docente.tipoDocumento);
    this.formulario.controls['numeroDocumento'].setValue(this.docente.numeroDocumento);
    this.formulario.controls['cuit'].setValue(this.docente.cuit);
    this.formulario.controls['email'].setValue(this.docente.email);
    this.formulario.controls['legajo'].setValue(this.docente.legajo);
    this.formulario.controls['createAt'].setValue(this.transformDate(this.docente.createAt));

    // DESHABILITAR LOS CAMPOS QUE NO SE PUEDEN MODIFICAR
    this.formulario.controls['nombre'].disable();
    this.formulario.controls['apellido'].disable();
    this.formulario.controls['tipoDocumento'].disable();
    this.formulario.controls['numeroDocumento'].disable();
    this.formulario.controls['cuit'].disable();
    this.formulario.controls['legajo'].disable();
    this.formulario.controls['createAt'].disable();
  }

  public onChangeEmail() {
    this.docente.email = this.formulario.controls['email'].value;
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public save() {
    this.docenteService.actualizarDatosDocente(this.docente.id, this.docente).subscribe(data => {
      Swal.fire('Actualizar:', `Docente ${data.nombre}, ${data.apellido} actualizado con exito!`, 'success');
      this.router.navigate(['/docente']);
    });
  }
}
