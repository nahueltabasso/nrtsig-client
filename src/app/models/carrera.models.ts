import { Alumno } from './alumno.models';

export class Carrera {
    id: number;
    nombre: string;
    nombreCorto: string;
    duracion: number;
    descripcion: string;
    createAt: Date;
    tipoCarrera: TipoCarrera;
    departamento: Departamento;
    carreraActiva: boolean;
    planesCarrera: PlanCarrera[];
}

export class TipoCarrera {
    id: number;
    tipoCarrera: string;
    cantidadMaxAnios: number;
    cantidadMinAnios: number;
}

export class Departamento {
    id: number;
    codigo: string;
    denominacion: string;
}

export class CarreraFiltrosDTO {
    nombre: string;
    duracion: number;
    tipoCarrera: TipoCarrera;
    departamento: Departamento;
    estadoCarrera: boolean;
}

export class PlanCarrera {
    id: number;
    anioPlan: number;
    fechaCierre: Date;
    resolucion: string;
    createAt: Date;
    carrera: Carrera;
    departamento: Departamento;
    alumnosInscriptos: Alumno[]; 
}

export class PlanCarreraFiltrosDTO {
    anioPlanDesde: number;
    anioPlanHasta: number;
    carrera: Carrera;
    dpto: Departamento;
    tipoCarrera: TipoCarrera;
}

export class EstadoCarrera {
    id: number;
    codigo: string;
    descripcion: string;
    createAt: Date;
}

export class Comision {
    id: number;
    numeroComision: number;
    capacidadMaxima: number;
    capacidadActual: number;
    createAt: Date;
    planCarrera: PlanCarrera;
    aulas: Aula[];
    turnoCursado: number;
}

export class ComisionFiltrosDTO {
    numeroComision: number;
    carrera: Carrera;
    turnoCursado: number;
}

export class Aula {
    id: number;
    numeroSalon: number;
    createAt: Date;
    comision: Comision;
}

export class Docente {
    id: number;
    legajo: number;
    tipoDocumento: string;
    numeroDocumento: number;
    nombre: string;
    apellido: string;
    email: string;
    createAt: Date;
    sexo: string;
    cuit: string;
}

export class DocenteFiltrosDTO {
    nombre: string;
    departamento: Departamento;
    carrera: Carrera;
    asignatura: string;
}

export class Asignatura {
    id: number;
    nombre: string;
    descripcion: string;
    createAt:Date;
    nivel: number;
    planCarrera: PlanCarrera;
    asignaturasHijas: AsignaturaCorrelativa[];
    tipoAsignatura: number;
}

export class AsignaturaCorrelativa {
    id: number;
    idAsignaturaPrincipal: number;
    correlativa: Asignatura;
}

export class AsignaturaFiltrosDTO {
    nombre: string;
    nivel: number;
    carrera: Carrera;
}

export class DocenteComisionAsignatura {
    id: number;
    docente: Docente;
    comision: Comision;
    asignatura: Asignatura;
    diaHoraCursado: string;
    funcionProfesor: number;
    cantidadHorasSemanales: number;
}

export class EstadoAsignatura {
    id: number;
    codigo: string;
    descripcion: string;
    createAt: Date;
}