import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Alumno } from 'src/app/models/alumno.models';
import { Asignatura, Carrera, Comision } from 'src/app/models/carrera.models';
import { InscripcionAsignatura } from 'src/app/models/inscripcion.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { ComisionService } from 'src/app/services/comision.service';
import { DocenteService } from 'src/app/services/docente.service';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-inscripcion-asignatura',
  templateUrl: './inscripcion-asignatura.component.html',
  styleUrls: ['./inscripcion-asignatura.component.css']
})
export class InscripcionAsignaturaComponent implements OnInit {

  titulo: string;
  alumno: Alumno;
  formularioAlumno: FormGroup;
  formularioInscripcion: FormGroup;
  inscripcionAsignatura: InscripcionAsignatura = new InscripcionAsignatura();
  comboCarrera: Carrera[] = [];
  comboAsignatura: Asignatura[] = [];
  listDocentesLabel: String;
  comboComision: Comision[] = [];
  flagComboCarreraIsEmpty: boolean = false;
  flagLabelComision: boolean = false;
  isOptional = false;
  error: any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              public dialogRef: MatDialogRef<InscripcionAsignaturaComponent>,
              private fb: FormBuilder,
              private datePipe: DatePipe,
              private carreraService: CarreraService,
              private asignaturaService: AsignaturaService,
              private planCarreraService: PlancarreraService,
              private comisionService: ComisionService,
              private docenteService: DocenteService) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO INSCRIPCION ASIGNATURA';
    this.alumno = this.data.alumno as Alumno;
    this.inscripcionAsignatura.alumno = this.alumno;
    this.createForm();
    this.loadDataAlumno();
    this.carreraService.getCarrerasInscriptaSegunAlumno(this.alumno.id).subscribe(data => {
      this.comboCarrera = data;
      if (this.comboCarrera.length === 0) {
        this.flagComboCarreraIsEmpty = true;
        setTimeout(()=> {                           
            this.dialogRef.close();
        }, 3000);
      } else {
        this.formularioInscripcion.controls['asignatura'].disable();
        this.formularioInscripcion.controls['comision'].disable();
      }
    });
  }

  public createForm() {
    this.formularioAlumno = this.fb.group({
      nombre: [{value: '', disabled: true}],
      apellido: [{value: '', disabled: true}],
      legajo: [{value: '', disabled: true}],
      fechaNacimiento: [{value: '', disabled: true}],
      tipoDoc: [{value: '', disabled: true}],
      nroDoc: [{value: '', disabled: true}]
    });

    this.formularioInscripcion = this.fb.group({
      carrera: ['', Validators.required],
      asignatura: ['', Validators.required],
      comision: ['', Validators.required],
      nivel: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.max(6)])]
    });
  }

  public loadDataAlumno() {
    this.formularioAlumno.controls['nombre'].setValue(this.alumno.nombre);
    this.formularioAlumno.controls['apellido'].setValue(this.alumno.apellido);
    this.formularioAlumno.controls['legajo'].setValue(this.alumno.legajo);
    this.formularioAlumno.controls['fechaNacimiento'].setValue(this.transformDate(this.alumno.fechaNacimiento));
    this.formularioAlumno.controls['tipoDoc'].setValue(this.alumno.tipoDocumento);
    this.formularioAlumno.controls['nroDoc'].setValue(this.alumno.numeroDocumento);
  }

  public seleccionarCarrera(event) {
    let carrera = event;
    this.planCarreraService.obtenerPlanCarreraVigente(carrera.id).subscribe(data => {
      this.inscripcionAsignatura.planCarrera = data;
      const nivel = this.formularioInscripcion.controls['nivel'].value;
      this.asignaturaService.listarAsignaturasPosiblesInscripcionAlumno(this.alumno.id, nivel, this.inscripcionAsignatura.planCarrera.id).subscribe(asignaturas => {
        this.comboAsignatura = asignaturas;
        this.formularioInscripcion.controls['asignatura'].enable();
      });
    });
  }

  public seleccionarAsignatura(event) {
    this.inscripcionAsignatura.asignatura = event;
    const nivel = this.formularioInscripcion.controls['nivel'].value;
    this.comisionService.listarComisionesByNivelAndPlanCarrera(nivel, this.inscripcionAsignatura.planCarrera.id).subscribe(data => {
      this.comboComision = data;
      this.formularioInscripcion.controls['comision'].enable();
    });
  }

  public seleccionarComision(event) {
    this.inscripcionAsignatura.comision = event;
    const idComision = this.inscripcionAsignatura.comision.id;
    const idAsignatura = this.inscripcionAsignatura.asignatura.id;
    this.docenteService.obtenerLabelComision(idComision, idAsignatura).subscribe(data => {
      console.log("entra")
      console.log(data);
      this.listDocentesLabel = '';
      this.listDocentesLabel = data;
      this.flagLabelComision = true;
    });
  }

  public verInfoAlMomento(){}

  public save() {
    this.asignaturaService.registrarInscripcion(this.inscripcionAsignatura).subscribe(data => {
      Swal.fire('Nueva:', 'Inscripcion registrada con exito!', 'success');
      this.dialogRef.close();
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

}
