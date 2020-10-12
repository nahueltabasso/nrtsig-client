import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT, BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Docente, DocenteComisionAsignatura, DocenteFiltrosDTO } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT + '/docente';
  endPointDocenteComision = BASE_ENDPOINT_CARRERAS + '/docente-comision-controller';

  constructor(private http: HttpClient) { }

  listarDocentes(): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.endPointBase);
  }

  search(filter: DocenteFiltrosDTO): Observable<Docente[]> {
    return this.http.post<Docente[]>(this.endPointBase + '/search', filter);
  }

  obtenerLegajoDocente(): Observable<number> {
    return this.http.get<number>(this.endPointBase + '/generar-legajo-docente');
  }

  crearDocente(docente: Docente): Observable<Docente> {
    return this.http.post<Docente>(this.endPointBase + '/add-docente', docente);
  }

  getById(id: number): Observable<Docente> {
    return this.http.get<Docente>(this.endPointBase + '/obtener-docente/' + id);
  }

  actualizarDatosDocente(id: number, docente: Docente): Observable<Docente> {
    return this.http.put<Docente>(this.endPointBase + '/edit/' + id, docente);
  }

  filtrarPorNombre(termino: string): Observable<Docente[]> {
    return this.http.get<Docente[]>(this.endPointBase + '/filtrar-por-nombre/' + termino);
  }

  registrarDocenteComisionAsignatura(docenteComisionAsignatura: DocenteComisionAsignatura): Observable<DocenteComisionAsignatura> {
    return this.http.post<DocenteComisionAsignatura>(this.endPointDocenteComision, docenteComisionAsignatura);
  }

  obtenerLabelComision(idComision: number, idAsignatura: number): Observable<String> {
    return this.http.get<String>(this.endPointDocenteComision + '/mostrar-label/' + idComision + '/' + idAsignatura, {headers: this.cabeceras});
  }
}
