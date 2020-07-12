import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Observable } from 'rxjs';
import { InscripcionCarrera, EstadoInscripcion, InscripcionCarreraFiltrosDTO } from '../models/inscripcion.models';
import { EstadoCarrera } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class InscripcionCarreraService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/inscripcioncarrera';
  endPointEstadoCarrera = BASE_ENDPOINT_CARRERAS + '/estadocarrera';
  endPointEstadoInscripcion = BASE_ENDPOINT_CARRERAS + '/estadoinscripcion';

  constructor(private http: HttpClient) { }

  listar(): Observable<InscripcionCarrera[]> {
    return this.http.get<InscripcionCarrera[]>(this.endPointBase);
  }

  listarEstadoCarrera(): Observable<EstadoCarrera[]> {
    return this.http.get<EstadoCarrera[]>(this.endPointEstadoCarrera);
  }

  listarEstadoInscripcion(): Observable<EstadoInscripcion[]> {
    return this.http.get<EstadoInscripcion[]>(this.endPointEstadoInscripcion);
  }

  search(filter: InscripcionCarreraFiltrosDTO): Observable<InscripcionCarrera[]> {
    return this.http.post<InscripcionCarrera[]>(this.endPointBase + '/search', filter);
  }

  eliminarInscripcion(id: number): Observable<void> {
    return this.http.delete<void>(this.endPointBase + '/' + id);
  }
}
