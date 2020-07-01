import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Observable } from 'rxjs';
import { Carrera, TipoCarrera, Departamento, CarreraFiltrosDTO } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/carrera';
  endPointTipoCarrera = BASE_ENDPOINT_CARRERAS + '/tipocarrera';
  endPointDepartamento = BASE_ENDPOINT_CARRERAS + '/departamento';

  constructor(private http: HttpClient) { }

  listar(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.endPointBase);
  } 

  listarTipoCarrera(): Observable<TipoCarrera[]> {
    return this.http.get<TipoCarrera[]>(this.endPointTipoCarrera);
  }

  listarDepartamentos(): Observable<Departamento[]> {
    return this.http.get<Departamento[]>(this.endPointDepartamento);
  }

  eliminarCarrera(id: number): Observable<void> {
    return this.http.delete<void>(this.endPointBase + '/' + id);
  }

  search(filter: CarreraFiltrosDTO): Observable<Carrera[]> {
    return this.http.post<Carrera[]>(this.endPointBase + '/search', filter);
  }

  crearCarrera(carrera: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.endPointBase, carrera);
  }

  activarCarrera(idCarrera: Number): Observable<void> {
    return this.http.put<void>(this.endPointBase + '/' + idCarrera + '/activar-carrera', null);
  }
}
