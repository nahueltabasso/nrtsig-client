import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, flatMap } from 'rxjs/operators';
import { Asignatura, Carrera, Comision, Docente, DocenteComisionAsignatura } from 'src/app/models/carrera.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { ComisionService } from 'src/app/services/comision.service';
import { DocenteService } from 'src/app/services/docente.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';

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
  comboCarrera: Carrera[] = [];
  comboComision: Comision[] = [];
  comboAsignatura: Asignatura[] = [];
  idCarrera: number;
  flagAutoComplete: boolean = false;
  autocompleteCtrl = new FormControl();
  docentesAutocomplete: Docente[] = []; 
  hora: string;
  flagError: boolean = false;
  error: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<AsignarComisionAsignaturaComponent>,
              private docenteService: DocenteService,
              private carreraService: CarreraService,
              private asignaturaService: AsignaturaService,
              private comisionService: ComisionService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.titulo = 'ASIGNAR ASIGNATURA - COMISION'
    this.createForm();
    this.docente = this.data.docente as Docente;
    if (this.docente === null || this.docente === undefined) {
      this.flagAutoComplete = true;
      this.deshabilitarCampos();
      // CONFIGURACION DEL MAT-AUTOCOMPLETE
      this.autocompleteCtrl.valueChanges.pipe(
        map(valor => typeof valor === 'string'? valor : valor.nombre),
        flatMap(valor => valor? this.docenteService.filtrarPorNombre(valor) : []) 
      ).subscribe(docentes => {
        this.docentesAutocomplete = docentes;
      });
    } else {
      this.flagAutoComplete = false;
      this.formulario.controls['docente'].setValue(this.docente.nombre + this.docente.apellido);
      this.docenteComisionAsignatura.docente = this.docente;
    }
    this.deshabilitarCampos();
    this.carreraService.listar().subscribe(dataCarrera => {
      this.comboCarrera = dataCarrera;
    });
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

  public onChangeHoraCursado() {
    this.hora = '';
    this.hora = this.formulario.controls['horaCursado'].value;
  }

  public save() {
    // PRIMERO CONCATENAMOS EL DIA DE CURSADO CON LA HORA SELECCIONADA
    this.docenteComisionAsignatura.diaHoraCursado = this.docenteComisionAsignatura.diaHoraCursado + ' / ' + this.hora;
    this.flagError = false;
    this.docenteService.registrarDocenteComisionAsignatura(this.docenteComisionAsignatura).subscribe(data => {
        Swal.fire('Nuevo', 'Registrado con exito!', 'success');
        this.dialogRef.close();  
    }, err => {
      this.flagError = true;
      this.error = err.error.mensaje;
    });
  }

  public close() {
    this.dialogRef.close();
  }

  public mostrarDocente(docente? : Docente): string {
    return docente? docente.apellido + ',' + docente.nombre : '';
  }

  public seleccionarDocente(event: MatAutocompleteSelectedEvent): void {
    const docente = event.option.value as Docente;
    this.docente = docente;
    this.docenteComisionAsignatura.docente = this.docente;
    this.formulario.controls['docente'].setValue(this.docente.nombre + this.docente.apellido);
    this.autocompleteCtrl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

} 
