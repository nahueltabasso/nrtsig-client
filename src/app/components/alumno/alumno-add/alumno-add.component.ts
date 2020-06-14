import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AlumnoService } from 'src/app/services/alumno.service';
import { Alumno, Pais, Provincia, Ciudad, Domicilio } from 'src/app/models/alumno.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MIN_DNI, MAX_DNI, PATTERN_ONLYNUMBER, MAX_LENGTH_DNI, PATTERN_ONLYLETTERS, MAX_LENGTH_NAME_LASTNAME, MAX_LENGTH_CUIT } from 'src/app/shared/constants';

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
  comboPaises: Pais[] = [];
  comboProvincias: Provincia[] = [];
  comboCiudades: Ciudad[] = []; 

  constructor(private alumnoService: AlumnoService,
              private fb: FormBuilder,
              private router: Router,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO NUEVO ALUMNO';
    this.alumno.domicilio = new Domicilio();
    this.createForm();
    this.alumnoService.obtenerUltimoLegajo().subscribe(data => {
      this.alumno.legajo = data + 1;
    })
    this.alumnoService.listarPaises().subscribe(paises => {
      this.comboPaises = paises;
    });
    this.formulario.controls['provincia'].disable();
    this.formulario.controls['ciudad'].disable();
    this.formulario.controls['nroPiso'].disable();
    this.formulario.controls['nroDpto'].disable();
  }

  public createForm() {
    this.formulario = this.fb.group({
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
  }

  public seleccionarTipoDocumento(event): void {
    this.alumno.tipoDocumento = event;
  }

  public onChangeNombre(): void {
    this.alumno.nombre = this.formulario.controls['nombre'].value;
  }

  public onChangeApellido(): void {
    this.alumno.apellido = this.formulario.controls['apellido'].value;
  }

  public onChangeNumeroDocumento(): void {
    this.alumno.numeroDocumento = this.formulario.controls['numeroDocumento'].value;
  }

  public onChangeCUIT(): void {
    this.alumno.cuit = this.formulario.controls['cuit'].value;
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

  public seleccionarSexo(event): void {
    this.alumno.sexo = event;
  }

  public seleccionarPais(event): void {
    this.alumnoService.listarProvinciasByPais(event.id).subscribe(data => {
      this.comboProvincias = data;
      this.formulario.controls['provincia'].enable();
    });
  }

  public seleccionarProvincia(event): void {
    this.alumnoService.listarCiudadesByProvincia(event.id).subscribe(data => {
      this.comboCiudades = data;
      this.formulario.controls['ciudad'].enable();
    });
  }

  public seleccionarCiudad(event): void {
    let ciudad = event;
    this.alumno.ciudad = ciudad;
    this.alumno.domicilio.ciudad = ciudad;
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

  public validatorCUIT() {
    try {
      const cuit = this.formulario.get('cuit').value;
      const dni = this.formulario.get('numeroDocumento').value;
      let k = 0;
      for (let i = 2; i < cuit.length(); i++) {
        if (cuit[i] === dni[k]) {
          return { validatorCUIT : true };
        }
        k++;
      }
    } catch (error) {
      return { validatorCUIT: false };
    }
  }

  public selectFechaNacimiento(type: string, event: MatDatepickerInputEvent<Date>): void {
    if (type !== 'input') {
      const date = this.transformDate(event.value);
      this.formulario.controls['fechaNacimientoTxt'].setValue(date);
      this.alumno.fechaNacimiento = event.value;
    } else {
      const from = this.formulario.get('fechaNacimientoTxt').value.split('/');
      const year = Number(from[2]);
      const month = Number(from[1]) - 1; 
      const day = Number(from[0]);
      const date = new Date(year, month, day);
      this.formulario.controls['fechaPicker'].setValue(date);
      this.alumno.fechaNacimiento = date;
    }
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public save(): void {
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
