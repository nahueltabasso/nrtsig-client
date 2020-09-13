import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Docente } from 'src/app/models/carrera.models';
import { DocenteService } from 'src/app/services/docente.service';

@Component({
  selector: 'app-docente-view',
  templateUrl: './docente-view.component.html',
  styleUrls: ['./docente-view.component.css']
})
export class DocenteViewComponent implements OnInit {

  titulo: string;
  docente: Docente;
  formulario: FormGroup;
  error: any;
  flagDocenteExist: boolean = false;;

  constructor(private docenteService: DocenteService,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

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
      email: [{value: '', disabled: true}],
      legajo: [{value: '', disabled:true}],
      createAt: [{value: '', disabled:true}]
    });
  }

  public loadDataDocente() {
    this.formulario.controls['nombre'].setValue(this.docente.nombre);
    this.formulario.controls['nombre'].disable();
    this.formulario.controls['apellido'].setValue(this.docente.apellido);
    this.formulario.controls['apellido'].disable();
    this.formulario.controls['genero'].setValue(this.docente.sexo);
    this.formulario.controls['genero'].disable();
    this.formulario.controls['tipoDocumento'].setValue(this.docente.tipoDocumento);
    this.formulario.controls['tipoDocumento'].disable();
    this.formulario.controls['numeroDocumento'].setValue(this.docente.numeroDocumento);
    this.formulario.controls['numeroDocumento'].disable();
    this.formulario.controls['cuit'].setValue(this.docente.cuit);
    this.formulario.controls['cuit'].disable();
    this.formulario.controls['email'].setValue(this.docente.email);
    this.formulario.controls['email'].disable();
    this.formulario.controls['legajo'].setValue(this.docente.legajo);
    this.formulario.controls['legajo'].disable();
    this.formulario.controls['createAt'].setValue(this.transformDate(this.docente.createAt));
    this.formulario.controls['createAt'].disable();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
