import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Docente } from 'src/app/models/carrera.models';
import { DocenteService } from 'src/app/services/docente.service';
import { MAX_DNI, MAX_LENGTH_CUIT, MAX_LENGTH_DNI, MAX_LENGTH_NAME_LASTNAME, MIN_DNI, PATTERN_ONLYLETTERS, PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-docente-add',
  templateUrl: './docente-add.component.html',
  styleUrls: ['./docente-add.component.css']
})
export class DocenteAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  docente: Docente = new Docente();
  error: any;

  constructor(private docenteService: DocenteService,
              private fb: FormBuilder,
              private router: Router) { }
    
  ngOnInit(): void {
    this.createForm();
    this.titulo = 'FORMULARIO NUEVO DOCENTE';
    this.docenteService.obtenerLegajoDocente().subscribe(data => {
      this.docente.legajo = data;
    });
  }
    
  public createForm() {
    this.formulario = this.fb.group({
      nombre: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS), Validators.maxLength(MAX_LENGTH_NAME_LASTNAME)])],
      apellido: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS)])],
      genero: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      numeroDocumento: [null, Validators.compose([Validators.required, Validators.min(MIN_DNI), Validators.max(MAX_DNI), Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_DNI)])],
      cuit: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_CUIT)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
    });
  }

  public onChangeNombre(): void {
    this.docente.nombre = this.formulario.controls['nombre'].value;
  }

  public onChangeApellido(): void {
    this.docente.apellido = this.formulario.controls['apellido'].value;
  }

  public onChangeNumeroDocumento(): void {
    this.docente.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
  }

  public onChangeCUIT(): void {
    this.docente.cuit = this.formulario.controls['cuit'].value;
  }

  public onChangeEmail(): void {
    this.docente.email = this.formulario.controls['email'].value;
  }

  public seleccionarSexo(event): void {
    this.docente.sexo = event;
  }

  public seleccionarTipoDocumento(event): void {
    this.docente.tipoDocumento = event;
  }

  public save(event) {
    if (!this.formulario.valid) return ;
  
    console.log(this.docente);
    this.docenteService.crearDocente(this.docente).subscribe(data => {
      Swal.fire('Nuevo:', `Docente ${data.nombre} ${data.apellido} agregado con exito!`, 'success');
      this.router.navigate(['/docente']);
    });
  }
}
