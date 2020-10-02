import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Asignatura, Carrera, Comision, Docente, DocenteComisionAsignatura } from 'src/app/models/carrera.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { ComisionService } from 'src/app/services/comision.service';
import { DocenteService } from 'src/app/services/docente.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';

@Component({
  selector: 'app-asignar-comision-asignatura',
  templateUrl: './asignar-comision-asignatura.component.html',
  styleUrls: ['./asignar-comision-asignatura.component.css']
})
export class AsignarComisionAsignaturaComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  docente: Docente = new Docente();
  docenteComisionAsignatura: DocenteComisionAsignatura = new DocenteComisionAsignatura();
  flagAutoComplete: boolean = false;
  comboCarrera: Carrera[] = [];
  comboComision: Comision[] = [];
  comboAsignatura: Asignatura[] = [];
  idCarrera: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<AsignarComisionAsignaturaComponent>,
              private docenteService: DocenteService,
              private carreraService: CarreraService,
              private asignaturaService: AsignaturaService,
              private comisionService: ComisionService,
              private fb: FormBuilder) { }

  ngOnInit(): void {
    this.titulo = 'ASIGNAR ASIGNATURA - COMISION'
    this.createForm();
    this.docente = this.data.docente as Docente;
    if (!this.docente) {
      this.flagAutoComplete = true;
    } else {
      this.formulario.controls['docente'].setValue(this.docente.nombre + this.docente.apellido);
      this.docenteComisionAsignatura.docente = this.docente;
      this.deshabilitarCampos();
      this.carreraService.listar().subscribe(dataCarrera => {
        this.comboCarrera = dataCarrera;
      });
    }
  }

  public createForm() {
    this.formulario = this.fb.group({
      docente: ['', Validators.required],
      carrera: ['', Validators.required],
      asignatura: ['', Validators.required],
      comision: ['', Validators.required],
      diaCursado: ['', Validators.required],
      horaCursado: ['', Validators.required],
      funcionProfesor: ['', Validators.required],
      cantidadHorasSemanales: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.min(2), Validators.max(4)])]
    });  
  }

  private deshabilitarCampos() {
    // SOLO DESHABILITAMOS LOS CAMPOS QUE INCLUYEN ALGUNA LOGICA PARA HABILITAR OTRO CAMPO
    this.formulario.controls['docente'].disable();
    this.formulario.controls['comision'].disable();
    this.formulario.controls['asignatura'].disable();
    this.formulario.controls['diaCursado'].disable();
    this.formulario.controls['horaCursado'].disable();
  }

  public seleccionarCarrera(event) {
    this.idCarrera = event.id
    this.comisionService.listarComisionesByCarrera(this.idCarrera).subscribe(data => {
      this.comboComision = data;
      this.formulario.controls['comision'].enable();
    });
  }

  public seleccionarComision(event) {
    this.docenteComisionAsignatura.comision = event;
    const nroComision = this.docenteComisionAsignatura.comision.numeroComision;
    const idComision = this.docenteComisionAsignatura.comision.id;
    this.asignaturaService.listarAsignaturaByCarrera(this.idCarrera, idComision, nroComision).subscribe(data => {
      this.comboAsignatura = data;
      this.formulario.controls['asignatura'].enable();
      this.formulario.controls['diaCursado'].enable();
    });
  }

  public seleccionarAsignatura(event) {
    this.docenteComisionAsignatura.asignatura = event;
  }

  public seleccionarFuncion(event) {
    this.docenteComisionAsignatura.funcionProfesor = event;
  }

  public seleccionarDiaCursado(event) {
    this.docenteComisionAsignatura.diaHoraCursado = event;
    this.formulario.controls['horaCursado'].enable();
  }

  public onChangeCantidadHorasSemanales() {
    this.docenteComisionAsignatura.cantidadHorasSemanales = this.formulario.controls['cantidadHorasSemanales'].value;
  }

  public onChangeHoraCursado(event) {
    const hora = this.formulario.controls['horaCursado'].value;
    console.log(hora);
    this.docenteComisionAsignatura.diaHoraCursado = this.docenteComisionAsignatura.diaHoraCursado + ' / ' + hora;
  }

  public save() {
    console.log(this.docenteComisionAsignatura);
  }

  public close() {
    this.dialogRef.close();
  }

} 
