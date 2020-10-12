import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Asignatura, AsignaturaFiltrosDTO, EstadoAsignatura } from '../models/carrera.models';
import { InscripcionAsignatura, InscripcionAsignaturaFiltrosDTO, InscripcionAsignaturaGroup } from '../models/inscripcion.models';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/asignatura';
  endPointInscripcionAsignatura = BASE_ENDPOINT_CARRERAS + '/inscripcion-asignatura';
  endPointEstadosInscripcion = BASE_ENDPOINT_CARRERAS + '/estadoasignatura';

  constructor(private http: HttpClient) { }

  listarAsignaturas(): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.endPointBase);
  }

  search(filter: AsignaturaFiltrosDTO): Observable<Asignatura[]> {
    return this.http.post<Asignatura[]>(this.endPointBase + '/search', filter);
  }

  eliminarAsignatura(id: number): Observable<void> {
    return this.http.delete<void>(this.endPointBase + '/' + id);
  }

  getAsignaturasPosiblesCorrelativas(nivel: number, idPlanCarrera: number, tipoAsignatura: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.endPointBase + '/posibles-correlatividades?nivel=' + nivel + '&idPlanCarrera=' + idPlanCarrera + '&tipo=' + tipoAsignatura);
  }

  guardarAsignatura(asignatura: Asignatura): Observable<Asignatura> {
    return this.http.post<Asignatura>(this.endPointBase, asignatura);
  }

  getAsignaturaById(id: number): Observable<Asignatura> {
    return this.http.get<Asignatura>(this.endPointBase + '/' + id);
  }

  actualizarAsignatura(id: number, descripcion: string): Observable<void> {
    return this.http.put<void>(this.endPointBase + '/' + id, descripcion);
  }

  listarAsignaturaByCarrera(idCarrera: number, idComision:number, nroComision: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.endPointBase + '/listar-asignaturas-carrera/' + idCarrera 
                                       + '/comision/' + idComision + '?nroComision=' + nroComision);
  }

  listarAsignaturasPosiblesInscripcionAlumno(idAlumno: number, nivel: number, idPlanCarrera: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.endPointBase + '/listar-posibles-asignaturas-inscripcion-alumno/' + idAlumno + '/' + nivel + '/' + idPlanCarrera);
  }

  listarAsignaturasSegunNivelAndPlanCarrera(nivel: number, idPlanCarrera: number): Observable<Asignatura[]> {
    return this.http.get<Asignatura[]>(this.endPointBase + '/listar-asignaturas-segun-nivel-plancarrera/' + nivel + '/' + idPlanCarrera);
  }

  registrarInscripcion(inscripcionAsignatura: InscripcionAsignatura): Observable<InscripcionAsignatura> {
    return this.http.post<InscripcionAsignatura>(this.endPointInscripcionAsignatura, inscripcionAsignatura);
  }

  listarInscripciones(): Observable<InscripcionAsignatura[]> {
    return this.http.get<InscripcionAsignatura[]>(this.endPointInscripcionAsignatura);
  }

  listarEstadosInscripcion(): Observable<EstadoAsignatura[]> {
    return this.http.get<EstadoAsignatura[]>(this.endPointEstadosInscripcion);
  }

  searchInscripciones(filterDTO: InscripcionAsignaturaFiltrosDTO): Observable<InscripcionAsignatura[]> {
    return this.http.post<InscripcionAsignatura[]>(this.endPointInscripcionAsignatura + '/search', filterDTO);
  }

  registrarInscripciones(dto: InscripcionAsignaturaGroup): Observable<number> {
    return this.http.post<number>(this.endPointInscripcionAsignatura + '/registrar-inscripcions-group', dto);
  }
}
