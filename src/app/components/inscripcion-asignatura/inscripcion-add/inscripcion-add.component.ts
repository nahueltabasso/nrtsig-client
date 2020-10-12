import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { flatMap, map } from 'rxjs/operators';
import { Alumno } from 'src/app/models/alumno.models';
import { Asignatura, Carrera, Comision } from 'src/app/models/carrera.models';
import { InscripcionAsignaturaGroup } from 'src/app/models/inscripcion.models';
import { AlumnoService } from 'src/app/services/alumno.service';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { ComisionService } from 'src/app/services/comision.service';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import Swal from 'sweetalert2';
import { AlumnoViewComponent } from '../../alumno/alumno-view/alumno-view.component';

@Component({
  selector: 'app-inscripcion-add',
  templateUrl: './inscripcion-add.component.html',
  styleUrls: ['./inscripcion-add.component.css']
})
export class InscripcionAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  comboCarrera: Carrera[] = [];
  comboComision: Comision[] = [];
  comboAsignatura: Asignatura[] = [];
  autocompleteCtrl = new FormControl();
  alumnosAutocomplete: Alumno[] = [];
  flagError: boolean = false;
  error: string;
  alumnosSeleccionados: Alumno[] = [];
  flagComboCarreraIsEmpty: boolean = false;
  inscripciones: InscripcionAsignaturaGroup = new InscripcionAsignaturaGroup();
  isOptional: boolean = false;
  displayedColumns: string[] = ['legajo', 'nombre', 'apellido', 'accion'];

  constructor(private alumnoService: AlumnoService,
              private carreraService: CarreraService,
              private asignaturaService: AsignaturaService,
              private comisionService: ComisionService,
              private planCarreraService: PlancarreraService,
              private fb: FormBuilder,
              private router: Router,
              private dialog: MatDialog) { }

  ngOnInit(): void {
    this.titulo = 'INSCRIPCION ASIGNATURA';
    this.createForm();
    this.autocompleteCtrl.valueChanges.pipe(
      map(valor => typeof valor === 'string' ? valor : valor.nombre),
      flatMap(valor => valor ? this.alumnoService.filtrarPorNombre(valor) : []))
      .subscribe(alumnos => {
        this.alumnosAutocomplete = alumnos.filter(a => {
          let filtrar = true
          this.alumnosSeleccionados.forEach(alumnoSelec => {
            if (a.id === alumnoSelec.id) {
              filtrar = false;
            }
          });
          return filtrar;
        });
      });
    
    this.carreraService.listar().subscribe(data => {
      this.comboCarrera = data;
      if (this.comboCarrera.length === 0) {
        this.flagComboCarreraIsEmpty = true;
        setTimeout(()=> {                           
            this.router.navigate(['/inscripcionesasignatura']);
        }, 3000);
      } else {
        this.formulario.controls['asignatura'].disable();
        this.formulario.controls['comision'].disable();
      }   
    });
  }

  public createForm() {
    this.formulario = this.fb.group({
      nivel: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.max(6)])],
      carrera: ['', Validators.required],
      asignatura: ['', Validators.required],
      comision: ['', Validators.required]
    });
  }

  public seleccionarCarrera(event) {
    let carrera = event;
    this.planCarreraService.obtenerPlanCarreraVigente(carrera.id).subscribe(data => {
      this.inscripciones.planCarrera = data;
      const nivel = this.formulario.controls['nivel'].value;
      this.asignaturaService.listarAsignaturasSegunNivelAndPlanCarrera(nivel, this.inscripciones.planCarrera.id).subscribe(asignaturas => {
        this.comboAsignatura = asignaturas;
        this.formulario.controls['asignatura'].enable();
      });
    });
  }

  public seleccionarAsignatura(event) {
    this.inscripciones.asignatura = event;
    const nivel = this.formulario.controls['nivel'].value;
    this.comisionService.listarComisionesByNivelAndPlanCarrera(nivel, this.inscripciones.planCarrera.id).subscribe(data => {
      this.comboComision = data;
      this.formulario.controls['comision'].enable();
    });
  }

  public seleccionarComision(event) {
    this.inscripciones.comision = event;
  }

  public eliminarDeAlumnosSeleccionados(alumno: Alumno) {
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.id != alumno.id);
  }

  public save() {
    this.inscripciones.alumnos = this.alumnosSeleccionados;
    this.asignaturaService.registrarInscripciones(this.inscripciones).subscribe(data => {
      Swal.fire('Nueva:', data + ' Inscripciones registradas con exito!', 'success');
      this.router.navigate(['/inscripcionesasignatura']);
    }, err => {
      Swal.fire('Error:', `${err.error.error}`, 'error');
      this.router.navigate(['/inscripcionesasignatura']);
    });
  }

  public mostrarAlumno(alumno?: Alumno): string {
    return alumno? alumno.apellido + ', ' + alumno.nombre : '';
  }

  public seleccionarAlumno(event: MatAutocompleteSelectedEvent): void {
    const alumno = event.option.value as Alumno;
    this.alumnosSeleccionados = this.alumnosSeleccionados.concat(alumno);
    this.autocompleteCtrl.setValue('');
    event.option.deselect();
    event.option.focus();
  }

  public verInfoAlMomento() {}

  public verAlumno(alumno: Alumno): void {
    const modalRef = this.dialog.open(AlumnoViewComponent, { 
      width: '1000px',
      data: { alumno: alumno }
     });

     modalRef.afterClosed().subscribe(data => {
       
     });
  }
}
