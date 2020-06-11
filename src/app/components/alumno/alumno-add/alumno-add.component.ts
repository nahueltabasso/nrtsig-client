import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno } from 'src/app/models/alumno.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alumno-add',
  templateUrl: './alumno-add.component.html',
  styleUrls: ['./alumno-add.component.css']
})
export class AlumnoAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  alumno: Alumno = new Alumno();
  error: any;

  constructor(private alumnoService: AlumnoService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO NUEVO ALUMNO';
    this.createForm();
  }

  createForm() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fechaNacimientoTxt: ['', [Validators.required]],
      fechaPicker: ['', ],
      genero: ['', [Validators.required]],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required, Validators.min(1000000), Validators.max(99999999)],
      cuit: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      telefono: ['', ],
      direccion: ['', [Validators.required]],
      numeroCalle: ['', [Validators.required]],
      isDpto: ['',],
      nroPiso: ['',],
      nroDpto: ['',],
      pais: ['', [Validators.required]],
      provincia: ['', [Validators.required]],
      ciudad: ['', [Validators.required]]
    });
  }

  seleccionarTipoDocumento(event): void {
    this.alumno.tipoDocumento = event;
  }

  onChangeNumeroDocumento(): void {
    this.alumno.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
  }

  seleccionarSexo(event): void {
    this.alumno.sexo = event;
  }

  save(): void {
    console.log(this.alumno);
    this.alumnoService.crear(this.alumno).subscribe(data => {
      Swal.fire('Nuevo:', `Alumno ${data.nombre}, ${data.apellido} agregado con exito!`, 'success');
      this.router.navigate(['/alumnos']);
    }, err => {
      if (err.status == 400) {
        this.error = err.error;
      }
    });
  }
}
