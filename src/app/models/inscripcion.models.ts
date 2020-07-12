import { PlanCarrera, EstadoCarrera, Departamento } from './carrera.models';
import { Alumno } from './alumno.models';

export class InscripcionCarrera {
    id: number;
    fechaInscripcion: Date;
    notaPromedio: number;
    createAt: Date;
    cantidadAsignaturas: number;
    planCarrera: PlanCarrera;
    alumno: Alumno;
    fechaEgreso: Date;
    estadoCarrera: EstadoCarrera;
    estadoInscripcion: EstadoInscripcion;
}

export class EstadoInscripcion {
    id: number;
    codigo: string;
    descripcion: string;
    createAt: Date;
}

export class InscripcionCarreraFiltrosDTO {
    nombreCarrera: string;
    estadoCarrera: EstadoCarrera;
    estadoInscripcion: EstadoInscripcion;
    cantAsignaturasAprobDesde: number;
    cantAsignaturasAprobHasta: number;
    fechaInscripcionDesde: Date;
    fechaInscripcionHasta: Date;
    nombreAlumno: string;
    apellidoAlumno: string;
    departamento: Departamento;
}