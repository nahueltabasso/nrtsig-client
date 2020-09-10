import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ComisionService } from 'src/app/services/comision.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Aula, Comision } from 'src/app/models/carrera.models';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignar-aula',
  templateUrl: './asignar-aula.component.html',
  styleUrls: ['./asignar-aula.component.css']
})
export class AsignarAulaComponent implements OnInit {

  titulo: string;
  formulario: FormGroup;
  aula: Aula = new Aula();
  comision: Comision;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private comisionService: ComisionService,
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<AsignarAulaComponent>) { }

  ngOnInit(): void {
    this.createForm();
    this.comision = this.data.comision as Comision;
    this.loadData();
    this.titulo = `Aula para la Comision ${this.comision.numeroComision}`;
    this.aula.comision = this.comision;
  }

  public createForm() {
    this.formulario = this.fb.group({
      numeroComision: ['', ],
      numeroSalon: ['', ]
    });
  }

  public loadData() {
    this.formulario.controls['numeroComision'].setValue(this.comision.numeroComision);
    this.formulario.controls['numeroComision'].disable();
    let numeroSalon;
    this.comisionService.obtenerNumeroSalon().subscribe(data => {
      numeroSalon = data;
      this.aula.numeroSalon = numeroSalon;
      this.formulario.controls['numeroSalon'].setValue(numeroSalon);
      this.formulario.controls['numeroSalon'].disable();
    });
  }

  public save() {
    Swal.fire({
      title: 'Estas Seguro?',
      text: `Seguro que desea asignar el aula a la comision ${this.comision.numeroComision}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Asignar'
    }).then((result) => {
      if (result.value) {
        this.comisionService.asignarAula(this.aula).subscribe(data => {
          this.dialogRef.close();
          Swal.fire('Asignado', 'Aula asignada a la comision', 'success');
        });
      }
    })
  }

  public close() {
    this.dialogRef.close();
  }
}
