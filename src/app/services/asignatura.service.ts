import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Asignatura, AsignaturaFiltrosDTO } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class AsignaturaService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/asignatura';

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
}
