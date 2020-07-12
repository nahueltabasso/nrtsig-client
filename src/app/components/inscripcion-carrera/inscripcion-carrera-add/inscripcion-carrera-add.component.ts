import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PATTERN_ONLYLETTERS, MAX_LENGTH_NAME_LASTNAME, MIN_DNI, MAX_DNI, PATTERN_ONLYNUMBER, MAX_LENGTH_DNI, MAX_LENGTH_CUIT } from 'src/app/shared/constants';
import { Alumno, Ciudad, Pais, Provincia, Domicilio } from 'src/app/models/alumno.models';
import { AlumnoService } from 'src/app/services/alumno.service';
import { InscripcionCarreraService } from 'src/app/services/inscripcion-carrera.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-inscripcion-carrera-add',
  templateUrl: './inscripcion-carrera-add.component.html',
  styleUrls: ['./inscripcion-carrera-add.component.css']
})
export class InscripcionCarreraAddComponent implements OnInit {

  formularioAlumno: FormGroup;
  formularioCarrera: FormGroup;
  isOptional = false;
  alumno: Alumno = new Alumno();
  comboPaises: Pais[] = [];
  comboProvincias: Provincia[] = [];
  comboCiudades: Ciudad[] = []; 

  constructor(private fb: FormBuilder,
              private alumnoService: AlumnoService,
              private inscripcionCarreraService: InscripcionCarreraService,
              private carreraService: CarreraService,
              private datePipe: DatePipe) { }

  ngOnInit() {
    this.createForm();
    this.alumno.domicilio = new Domicilio();
    this.alumnoService.obtenerUltimoLegajo().subscribe(data => {
      this.alumno.legajo = data + 1;
    })
    this.alumnoService.listarPaises().subscribe(paises => {
      this.comboPaises = paises;
    });
    this.formularioAlumno.controls['provincia'].disable();
    this.formularioAlumno.controls['ciudad'].disable();
    this.formularioAlumno.controls['nroPiso'].disable();
    this.formularioAlumno.controls['nroDpto'].disable();


  }

  public createForm() {
    // CREAR EL FORMULARIO PARA EL ALUMNO
    this.formularioAlumno = this.fb.group({
      nombre: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS), Validators.maxLength(MAX_LENGTH_NAME_LASTNAME)])],
      apellido: [null, Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYLETTERS)])],
      fechaNacimientoTxt: [null, Validators.required],
      fechaPicker: [null, ],
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

    // CREAR EL FORMULARIO PARA LA CARRERA
    this.formularioCarrera = this.fb.group({
      secondCtrl: ['', Validators.required]
    });
  }

  public seleccionarTipoDocumento(event): void {
    this.alumno.tipoDocumento = event;
  }

  public onChangeNombre(): void {
    this.alumno.nombre = this.formularioAlumno.controls['nombre'].value;
  }

  public onChangeApellido(): void {
    this.alumno.apellido = this.formularioAlumno.controls['apellido'].value;
  }

  public onChangeNumeroDocumento(): void {
    this.alumno.numeroDocumento = this.formularioAlumno.controls['numeroDocumento'].value;
  }

  public onChangeCUIT(): void {
    this.alumno.cuit = this.formularioAlumno.controls['cuit'].value;
  }

  public onChangeEmail(): void {
    this.alumno.email = this.formularioAlumno.controls['email'].value;
  }

  public onChangeTelefono(): void {
    this.alumno.telefono = this.formularioAlumno.controls['telefono'].value;
  }

  public onChangeDireccion(): void {
    this.alumno.domicilio.direccion = this.formularioAlumno.controls['direccion'].value;
  }

  public onChangeNumeroCalle(): void {
    this.alumno.domicilio.numero = Number.parseInt(this.formularioAlumno.controls['numeroCalle'].value);
  }

  public onChangeNroPiso(): void {
    this.alumno.domicilio.nroPiso = this.formularioAlumno.controls['nroPiso'].value; 
  }

  public onChangeNroDepartamento(): void {
    this.alumno.domicilio.nroDepartamento = this.formularioAlumno.controls['nroDpto'].value;
  }

  public seleccionarSexo(event): void {
    this.alumno.sexo = event;
  }

  public seleccionarPais(event): void {
    this.alumnoService.listarProvinciasByPais(event.id).subscribe(data => {
      this.comboProvincias = data;
      this.formularioAlumno.controls['provincia'].enable();
    });
  }

  public seleccionarProvincia(event): void {
    this.alumnoService.listarCiudadesByProvincia(event.id).subscribe(data => {
      this.comboCiudades = data;
      this.formularioAlumno.controls['ciudad'].enable();
    });
  }

  public seleccionarCiudad(event): void {
    let ciudad = event;
    this.alumno.ciudad = ciudad;
    this.alumno.domicilio.ciudad = ciudad;
  }

  public seleccionDpto(event): void {
    if (event) {
      this.formularioAlumno.controls['nroPiso'].enable();
      this.formularioAlumno.controls['nroDpto'].enable();
    } else {
      this.formularioAlumno.controls['nroPiso'].disable();
      this.formularioAlumno.controls['nroDpto'].disable();  
    }
  }

  public selectFechaNacimiento(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formularioAlumno.controls['fechaNacimientoTxt'].setValue(date);
      this.alumno.fechaNacimiento = event.value;
    } else {
      const from = this.formularioAlumno.get('fechaNacimientoTxt').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1; 
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formularioAlumno.controls['fechaPicker'].setValue(date);
      this.alumno.fechaNacimiento = date;
    }
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }



}
