import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Alumno } from 'src/app/models/alumno.models';
import { AlumnoService } from 'src/app/services/alumno.service';
import { InscripcionCarreraService } from 'src/app/services/inscripcion-carrera.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { DatePipe } from '@angular/common';
import { PlanCarrera, TipoCarrera, Carrera } from 'src/app/models/carrera.models';
import { InscripcionCarrera } from 'src/app/models/inscripcion.models';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-inscripcion-carrera-add',
  templateUrl: './inscripcion-carrera-add.component.html',
  styleUrls: ['./inscripcion-carrera-add.component.css']
})
export class InscripcionCarreraAddComponent implements OnInit {

  titulo: string;
  formularioAlumno: FormGroup;
  formularioCarrera: FormGroup;
  isOptional = false;
  alumno: Alumno = new Alumno();
  flagInscripcionCarrera: boolean = true;
  planCarrera: PlanCarrera = new PlanCarrera();
  inscripcion: InscripcionCarrera = new InscripcionCarrera();
  comboTipoCarrera: TipoCarrera[] = [];
  comboCarrera: Carrera[] = [];
  error: boolean = false;
  errorMessage: string;
  idAlumno: number;

  constructor(private fb: FormBuilder,
              private inscripcionCarreraService: InscripcionCarreraService,
              private carreraService: CarreraService,
              private planCarreraService: PlancarreraService,
              private alumnoService: AlumnoService,
              private datePipe: DatePipe,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.titulo = 'FORMULARIO INSCRIPCION CARRERA';
    this.createForm();
    this.activatedRoute.paramMap.subscribe(params => {
      this.idAlumno = Number (params.get('idAlumno'));
      if (this.idAlumno === null) {
        this.completarAndHabilitarCampos();
      } else {
        this.completarAndHabilitarCampos();
      }
    });
  }

  public createForm() {
    // CREAR EL FORMULARIO PARA LA CARRERA
    this.formularioCarrera = this.fb.group({
      tipoCarrera: ['', Validators.required],
      carrera: ['', Validators.required],
      fechaInscripcion: [new Date(), ],
      resolucion: ['', ],
      anioPlan: ['', ] 
    });
  }

  public completarAndHabilitarCampos() {
    this.carreraService.listarTipoCarrera().subscribe(data => {
      this.comboTipoCarrera = data;
    });
    this.formularioCarrera.controls['carrera'].disable();
    this.formularioCarrera.controls['fechaInscripcion'].setValue(this.transformDate(new Date()));
    this.formularioCarrera.controls['fechaInscripcion'].disable();
    this.formularioCarrera.controls['resolucion'].disable();
    this.formularioCarrera.controls['anioPlan'].disable();
    this.inscripcion.fechaInscripcion = new Date();    
  }


  public obtenerAlumnoParaInscripcion(event): void {
    const id = event;
    this.alumnoService.getById(id).subscribe(data => {
      this.alumno = data;
      this.inscripcion.alumno = this.alumno;
      console.log('1',this.inscripcion.alumno);
    });
  }

  public seleccionarTipoCarrera(event) {
    const id = event;
    if (this.alumno.id != null) {
      this.carreraService.getCarrerasByTipoCarreraAndAlumno(id, this.alumno.id).subscribe(data => {
        this.comboCarrera = data;
        this.formularioCarrera.controls['carrera'].enable();
      });  
    } else {
      this.carreraService.getCarrerasByTipoCarrera(id).subscribe(data => {
        this.comboCarrera = data;
        this.formularioCarrera.controls['carrera'].enable();
      }); 
    }
  }

  public seleccionarCarrera(event): void {
    const id = event;
    this.planCarreraService.obtenerPlanCarreraVigente(id).subscribe(data => {
      this.planCarrera = data;
      this.inscripcion.planCarrera = this.planCarrera;
      this.formularioCarrera.controls['anioPlan'].setValue(this.planCarrera.anioPlan);
      this.formularioCarrera.controls['resolucion'].setValue(this.planCarrera.resolucion);
    });
  }

  public transformDate(date): string {
    return this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  public verInfoAlMomento(){}

  public registrarInscripcion() {
    // Validamos que el formulario de alumno se haya completado
    if (this.alumno === null || this.inscripcion.alumno === null) {
      this.error = true;
      this.errorMessage = 'Completa primero el formulario del Alumno. Una inscripcion debe tener un alumno asociado';
      return ;
    }

    // Validamos que el formulario de carrera se haya completado
    if (this.inscripcion.planCarrera === null) {
      this.error = true;
      this.errorMessage = 'Completa primero el formulario de la Carrera. Una inscripcion debe tener asociada una carrera';
      return ;
    }

    // De pasar las validaciones registramos la inscripcion
    this.inscripcionCarreraService.registrarInscripcion(this.inscripcion).subscribe(data => {
      Swal.fire('Nueva:', 'Inscripcion registrada con exito!', 'success');
      this.router.navigate(['/inscripcioncarrera']);
    });
  }
}
