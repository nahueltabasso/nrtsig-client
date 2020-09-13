import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BASE_ENDPOINT } from '../config/app';
import { Docente, DocenteFiltrosDTO } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {

  endPointBase = BASE_ENDPOINT + '/docente';

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
}
