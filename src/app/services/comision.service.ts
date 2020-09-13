import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Observable } from 'rxjs';
import { Comision, ComisionFiltrosDTO, Aula } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class ComisionService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/comision';
  endPointAula = BASE_ENDPOINT_CARRERAS + '/aula';

  constructor(private http: HttpClient) { }

  listar(): Observable<Comision[]> {
    return this.http.get<Comision[]>(this.endPointBase);
  }

  search(filter: ComisionFiltrosDTO): Observable<Comision[]> {
    return this.http.post<Comision[]>(this.endPointBase + '/search', filter);
  }

  crearComision(comision: Comision): Observable<Comision> {
    return this.http.post<Comision>(this.endPointBase, comision, { headers: this.cabeceras });
  }

  validaExistenciaComisionByCarrera(idPlanCarrera: number, nroComision: number): Observable<boolean> {
    let params = new HttpParams();
    params = params.append('nroComision', nroComision.toString());
    params = params.append('id_plan', idPlanCarrera.toString());
    return this.http.get<boolean>(this.endPointBase + '/valida-existencia-nrocomision-carrera', { params: params });
  }

  obtenerNumeroSalon(): Observable<number> {
    return this.http.get<number>(this.endPointAula + '/obtener-numero-salon');
  }

  asignarAula(aula: Aula): Observable<Aula> {
    return this.http.post<Aula>(this.endPointAula, aula);
  }

  getAulasByComision(idComision: number): Observable<Aula[]> {
    return this.http.get<Aula[]>(this.endPointAula + '/aula-comision/' + idComision);
  }

  eliminarComision(idComsion: number): Observable<void> {
    return this.http.delete<void>(this.endPointBase + '/' + idComsion);
  }

  liberarAula(aula: Aula): Observable<void> {
    return this.http.get<void>(this.endPointAula + '/liberar-aula/' + aula.id);
  }

  actualizarComision(comision: Comision): Observable<Comision> {
    return this.http.put<Comision>(this.endPointBase + '/' + comision.id, comision, { headers: this.cabeceras });
  }
}
