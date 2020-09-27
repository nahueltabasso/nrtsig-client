import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Comision, Carrera, Aula } from 'src/app/models/carrera.models';
import { CarreraService } from 'src/app/services/carrera.service';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import { ComisionService } from 'src/app/services/comision.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AsignarAulaComponent } from '../asignar-aula/asignar-aula.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-comision-add',
  templateUrl: './comision-add.component.html',
  styleUrls: ['./comision-add.component.css']
})
export class ComisionAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  comision: Comision = new Comision();
  error: string;
  comboCarrera: Carrera[] = [];
  displayedColumnsAula: string[] = ['id', 'numeroSalon', 'fechaAlta', 'nroComision', 'acciones'];
  aulaDataSource: Aula[] = [];
  flagError: boolean = false;
  flagAula: boolean = false;
  flagAsignarAulaButton: boolean = false;

  constructor(public dialog: MatDialogRef<ComisionAddComponent>,
              private fb: FormBuilder,
              private carreraService: CarreraService,
              private planCarreraService: PlancarreraService,
              private comisionService: ComisionService,
              public matDialog: MatDialog) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO COMISION';
    this.carreraService.listar().subscribe(data => {
      this.comboCarrera = data;
    });
    this.createForm();
  }

  public createForm() {
    this.formulario = this.fb.group({
      numeroComision: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      capacidadMaxima: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER)])],
      carrera: ['', Validators.required],
      turno: ['', Validators.required]
    });
  }

  public onChangeNumeroComision() {
    this.comision.numeroComision = this.formulario.controls['numeroComision'].value;
  }

  public onChangeCapacidad() {
    this.comision.capacidadMaxima = this.formulario.controls['capacidadMaxima'].value;
    this.comision.capacidadActual = 0;
  }

  public seleccionarCarrera(event) {
    this.planCarreraService.obtenerPlanCarreraVigente(event.id).subscribe(data => {
      this.comision.planCarrera = data;
    });
  }

  public seleccionarTurnoComision(event) {
    this.comision.turnoCursado = event;
  }

  public save() {
    // Primero validamos que la comision no exista para la carrera seleccionada
    let idPlan = this.comision.planCarrera.id;
    let nroComision = this.comision.numeroComision;
    this.comisionService.validaExistenciaComisionByCarrera(idPlan, nroComision).subscribe(data => {
      let validacion = data;
      if (validacion === true) {
        this.flagError = true;
        this.error = 'Ya existe una comision con ese numero para la carrera seleccionada';
        return;
      }

      // Si pasa la validacion
      this.comisionService.crearComision(this.comision).subscribe(d => {
        this.comision = d;
        this.formulario.controls['numeroComision'].disable();
        this.formulario.controls['capacidadMaxima'].disable();
        this.formulario.controls['carrera'].disable();
        this.flagAula = true;
        this.flagAsignarAulaButton = true ;
      });
    });
  }

  public close() {
    this.dialog.close();
  }

  public asignarAula() {
    const modalRef = this.matDialog.open(AsignarAulaComponent, {
      width: '50%',
      data: { comision: this.comision }
    });
    modalRef.afterClosed().subscribe(data => {
      this.cargarDataSourceAula();
    });
  }

  private cargarDataSourceAula() {
    this.comisionService.getAulasByComision(this.comision.id).subscribe(d => {
      this.aulaDataSource = d;
    });
  }

  public liberarAula(aula: Aula) {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea liberar el aula numero ${aula.numeroSalon}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, Liberar!'
    }).then((result) => {
      this.comisionService.liberarAula(aula).subscribe(data => {
        Swal.fire('Liberado', 'Aula liberada!', 'success');
        this.cargarDataSourceAula();
      });
    });
  }

}
