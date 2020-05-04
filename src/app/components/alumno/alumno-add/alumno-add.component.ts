import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlumnoService } from 'src/app/services/alumno.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alumno-add',
  templateUrl: './alumno-add.component.html',
  styleUrls: ['./alumno-add.component.css']
})
export class AlumnoAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;

  constructor(private alumnoService: AlumnoService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO ALUMNO';
    this.createForm();
  }

  createForm() {
    this.formulario = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      tipoDocumento: ['', Validators.required],
      numeroDocumento: ['', Validators.required],
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

}
