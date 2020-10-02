import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Asignatura, AsignaturaCorrelativa, Carrera } from 'src/app/models/carrera.models';
import { AsignaturaService } from 'src/app/services/asignatura.service';
import { CarreraService } from 'src/app/services/carrera.service';
import { PlancarreraService } from 'src/app/services/plancarrera.service';
import { PATTERN_ONLYNUMBER } from 'src/app/shared/constants';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignatura-add',
  templateUrl: './asignatura-add.component.html',
  styleUrls: ['./asignatura-add.component.css']
})
export class AsignaturaAddComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  correlativaCtrl = new FormControl()
  asignatura: Asignatura = new Asignatura();
  error: string;
  nivel: number; 
  flagCorrelativas: boolean = false;
  comboCarrera: Carrera[] = [];
  flagError: boolean = false;
  visible: boolean = true;
  selectable: boolean = true;
  removable: boolean = true;
  filteredAsignaturas: Observable<Asignatura[]>;
  correlativas: Asignatura[] = [];
  allOptions: Asignatura[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];

  @ViewChild('correlativaInput') correlativaInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private asignaturaService: AsignaturaService,
              private planCarreraService: PlancarreraService,
              private carreraService: CarreraService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.titulo = 'FORMULARIO ALTA ASIGNATURA';
    this.createForm();
    this.formulario.controls['carrera'].disable(); 
  }

  public createForm() {
    this.formulario = this.fb.group({
      nombre: ['', Validators.compose([Validators.required])],
      descripcion: ['', ],
      nivel: ['', Validators.compose([Validators.required, Validators.pattern(PATTERN_ONLYNUMBER), Validators.max(6), Validators.min(1)])],
      carrera: ['', Validators.compose([Validators.required])],
      tipoAsignatura: ['', Validators.compose([Validators.required])]
    });
  }

  public onChangeNombreAsignatura() {
    this.asignatura.nombre = this.formulario.controls['nombre'].value;
    this.mostrarSeccionCorrelativas();
  }

  public onChangeDescripcion() {
    this.asignatura.descripcion = this.formulario.controls['descripcion'].value;
    this.mostrarSeccionCorrelativas();
  }

  public onChangeNivel() {
    this.asignatura.nivel = this.formulario.controls['nivel'].value;
    this.nivel = this.asignatura.nivel;
    if (this.formulario.controls['nivel'].valid) {
      this.carreraService.getCarrerasByDuracion(this.nivel).subscribe(data => {
        this.comboCarrera = data;
        this.formulario.controls['carrera'].enable();
      });  
    } else {
      this.formulario.controls['carrera'].disable();
    }
    this.mostrarSeccionCorrelativas();
  }

  public seleccionarCarrera(event): void {
    let carrera = event;
    this.planCarreraService.obtenerPlanCarreraVigente(carrera.id).subscribe(data => {
      this.asignatura.planCarrera = data;
      this.flagError = false;
      if (this.asignatura.planCarrera === null) {
        this.error = 'La carrera seleccionada no tiene un plan vigente';
        this.flagError = true;
      }
      this.flagCorrelativas = false;
    });
    this.mostrarSeccionCorrelativas();
  }

  public seleccionarTipoAsignatura(event): void {
    this.asignatura.tipoAsignatura = event;
    this.mostrarSeccionCorrelativas();
  }
  

  add(event): void {
    const input = event.input;
    const value = event;
    // Agregar correlativa
    if (value) {
      this.correlativas.push(value);
    }
    // Reset the input value
    if (input) {
      input.value = '';
    }
    this.correlativaCtrl.setValue(null);
  }

  remove(correlativa: Asignatura): void {
    const index = this.correlativas.indexOf(correlativa);
    if (index >= 0) {
      this.correlativas.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let correlativa = event.option.value;
    this.correlativas.push(correlativa);
    this.correlativaInput.nativeElement.value = '';
    this.correlativaCtrl.setValue(null);
  }

  private _filter(value: string): Asignatura[] {
    const filterValue = value.toLowerCase();
    // return this.allOptions.filter();
    return this.allOptions.filter(o => o.nombre.toLowerCase().indexOf(filterValue) === 0);;
  }

  private mostrarSeccionCorrelativas() {
    if (this.formulario.controls['nombre'].valid &&
        this.formulario.controls['nivel'].valid &&
        this.formulario.controls['carrera'].valid &&
        this.formulario.controls['tipoAsignatura'].valid) {
      this.asignaturaService.getAsignaturasPosiblesCorrelativas(this.nivel, this.asignatura.planCarrera.id, this.asignatura.tipoAsignatura).subscribe(data => {
        this.allOptions = data;
        this.flagCorrelativas = true;
        this.filteredAsignaturas = this.correlativaCtrl.valueChanges.pipe(
          startWith(null),
          map((asignatura: Asignatura | null) => asignatura ? this._filter(asignatura.nombre) : this.allOptions.slice())
        );
      });
    }
  }

  public save() {
    // Completamos y asignamos las correlativas a la asignatura antes de guardar
    let list : AsignaturaCorrelativa[] = [];
    for (let i = 0; i < this.correlativas.length; i++) {
      let c : AsignaturaCorrelativa = new AsignaturaCorrelativa();
      c.correlativa = this.correlativas[i];
      list.push(c);
    }
    this.asignatura.asignaturasHijas = list;
    this.asignaturaService.guardarAsignatura(this.asignatura).subscribe(data => {
      Swal.fire('Nuevo', `Asignatura ${data.nombre} agregada con exito`, 'success');
      this.router.navigate(['/asignatura']);
    });
  }
}
