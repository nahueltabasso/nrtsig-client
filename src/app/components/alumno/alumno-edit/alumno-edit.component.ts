import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Alumno } from 'src/app/models/alumno.models';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PATTERN_ONLYLETTERS, MAX_LENGTH_NAME_LASTNAME, MIN_DNI, MAX_DNI, PATTERN_ONLYNUMBER, MAX_LENGTH_CUIT, MAX_LENGTH_DNI } from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-alumno-edit',
  templateUrl: './alumno-edit.component.html',
  styleUrls: ['./alumno-edit.component.css']
})
export class AlumnoEditComponent implements OnInit {

  titulo: string;
  alumno: Alumno = new Alumno();
  formulario: FormGroup;
  error: any;

  constructor(private alumnoService: AlumnoService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private fb: FormBuilder,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      const id: number = Number (params.get('id'));
      this.alumnoService.getById(id).subscribe(data => {
        this.alumno = data;
        if (this.alumno.sexo === 'M') {
          this.titulo = 'EDITAR ALUMNO';
        } else {
          this.titulo = 'EDITAR ALUMNA';
        }
        this.createForm();
        this.loadData();
      });
    });
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS), Validators.maxLength(MAX_LENGTH_NAME_LASTNAME)])],
      apellido: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS)])],
      fechaNacimientoTxt: [null, Validators.required],
      fechaPicker: [null, ],
      legajo: [null, ],
      genero: [null, Validators.required],
      tipoDocumento: [null, Validators.required],
      numeroDocumento: [null, Validators.compose([Validators.required, Validators.min(MIN_DNI), Validators.max(MAX_DNI), Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_DNI)])],
      cuit: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.maxLength(MAX_LENGTH_CUIT)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      telefono: [null, Validators.pattern(PATTERN_ONLYNUMBER)],
      direccion: [null, Validators.required],
      numeroCalle: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      isDpto: [null,],
      nroPiso: [null, Validators.pattern(PATTERN_ONLYNUMBER)],
      nroDpto: [null,],
      pais: [null, Validators.required],
      provincia: [null, Validators.required],
      ciudad: [null, Validators.required]
    });
  }

  public loadData() {
    this.formulario.controls['nombre'].setValue(this.alumno.nombre);
    this.formulario.controls['apellido'].setValue(this.alumno.apellido);
    this.formulario.controls['fechaNacimientoTxt'].setValue(this.transformDate(this.alumno.fechaNacimiento));
    this.formulario.controls['genero'].setValue(this.alumno.sexo);
    this.formulario.controls['tipoDocumento'].setValue(this.alumno.tipoDocumento);
    this.formulario.controls['numeroDocumento'].setValue(this.alumno.numeroDocumento);
    this.formulario.controls['legajo'].setValue(this.alumno.legajo)
    this.formulario.controls['cuit'].setValue(this.alumno.cuit);
    this.formulario.controls['pais'].setValue(this.alumno.ciudad.provincia.pais.nombre);
    this.formulario.controls['provincia'].setValue(this.alumno.ciudad.provincia.nombre);
    this.formulario.controls['ciudad'].setValue(this.alumno.ciudad.nombre);
    this.formulario.controls['telefono'].setValue(this.alumno.telefono);
    this.formulario.controls['email'].setValue(this.alumno.email);
    this.formulario.controls['direccion'].setValue(this.alumno.domicilio.direccion);
    this.formulario.controls['numeroCalle'].setValue(this.alumno.domicilio.numero);
    if (this.alumno.domicilio.nroPiso !== null || this.alumno.domicilio.nroDepartamento !== null) {
      this.formulario.controls['isDpto'].setValue(true);
      this.formulario.controls['nroPiso'].setValue(this.alumno.domicilio.nroPiso);
      this.formulario.controls['nroDpto'].setValue(this.alumno.domicilio.nroDepartamento);
    } else {
      this.formulario.controls['isDpto'].setValue(false);
      this.formulario.controls['nroPiso'].setValue('');
      this.formulario.controls['nroDpto'].setValue('');
    }

    // DESHABILITAR LOS CAMPOS QUE NO SE PUEDEN MODIFICAR
    this.formulario.controls['nombre'].disable();
    this.formulario.controls['apellido'].disable();
    this.formulario.controls['fechaNacimientoTxt'].disable();
    this.formulario.controls['genero'].disable();
    this.formulario.controls['tipoDocumento'].disable();
    this.formulario.controls['numeroDocumento'].disable();
    this.formulario.controls['legajo'].disable();
    this.formulario.controls['cuit'].disable();
    this.formulario.controls['pais'].disable();
    this.formulario.controls['provincia'].disable();
    this.formulario.controls['ciudad'].disable();

  }

  public onChangeEmail(): void {
    this.alumno.email = this.formulario.controls['email'].value;
  }

  public onChangeTelefono(): void {
    this.alumno.telefono = this.formulario.controls['telefono'].value;
  }

  public onChangeDireccion(): void {
    this.alumno.domicilio.direccion = this.formulario.controls['direccion'].value;
  }

  public onChangeNumeroCalle(): void {
    this.alumno.domicilio.numero = Number.parseInt(this.formulario.controls['numeroCalle'].value);
  }

  public onChangeNroPiso(): void {
    this.alumno.domicilio.nroPiso = this.formulario.controls['nroPiso'].value; 
  }

  public onChangeNroDepartamento(): void {
    this.alumno.domicilio.nroDepartamento = this.formulario.controls['nroDpto'].value;
  }

  public seleccionDpto(event): void {
    if (event) {
      this.formulario.controls['nroPiso'].enable();
      this.formulario.controls['nroDpto'].enable();
    } else {
      this.formulario.controls['nroPiso'].disable();
      this.formulario.controls['nroDpto'].disable();  
    }
  }

  public actualizarAlumno(): void {
    this.alumnoService.editar(this.alumno).subscribe(data => {
      Swal.fire('Actualizar:', `Alumno ${data.nombre}, ${data.apellido} actualizado con exito!`, 'success');
      this.router.navigate(['/alumnos']);
    }, err => {
      if (err.status == 400) {
        this.error = err.error;
      }
    });
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
