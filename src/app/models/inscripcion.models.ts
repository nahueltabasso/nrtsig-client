import { PlanCarrera, EstadoCarrera, Departamento, EstadoAsignatura, Comision, Asignatura, Carrera } from './carrera.models';
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

export class InscripcionAsignatura {
    id: number;
    fechaInscripcion: Date;
    alumno: Alumno;
    planCarrera: PlanCarrera;
    estadoAsignatura: EstadoAsignatura;
    comision: Comision;
    asignatura: Asignatura;
    nota: number;
    createAt: Date;
} 

export class InscripcionAsignaturaFiltrosDTO {
    nombreAlumno: string;
    nombreAsignatura: string;
    estadoAsignatura: string;
    carrera: Carrera;
    fechaInscripcionDesde: Date;
    fechaInscripcionHasta: Date;
}

export class InscripcionAsignaturaGroup {
    alumnos: Alumno[];
    planCarrera: PlanCarrera;
    comision: Comision;
    asignatura: Asignatura;
}