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

