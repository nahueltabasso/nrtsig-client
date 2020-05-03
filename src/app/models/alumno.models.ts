import { Generic } from './generic';

export class Alumno implements Generic {
    id: number;
    legajo: number;
    tipoDocumento: string;
    numeroDocumento: number;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    fechaNacimiento: Date;
    createAt: Date;
    cuit: string;
    sexo: string;
    ciudad: Ciudad;
    domicilio: Domicilio;
    fotoHashCode: number;
}

export class Ciudad implements Generic {
    id: number;
    nombre: string;
    codigo: string;
    provincia: Provincia;
}

export class Provincia implements Generic {
    id: number;
    nombre: string;
    codigo: string;
    pais: Pais;
}

export class Pais implements Generic {
    id: number;
    nombre: string;
    codigo: string;
}

export class Domicilio  {
    id: number;
    direccion: string;
    numero: number;
    nroDepartamento: number;
    nroPiso: number;
    ciudad: Ciudad;
}

/*
<mat-form-field appearance="outline">
<input matInput placeholder="Nombre" [value]="alumno.nombre" disabled>
</mat-form-field>                          
<mat-form-field appearance="fill">
  <input matInput placeholder="Apellido" [value]="alumno.apellido" disabled>
</mat-form-field>*/