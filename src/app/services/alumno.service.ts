import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno, Pais, Provincia, Ciudad } from '../models/alumno.models';
import { BASE_ENDPOINT } from '../config/app';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT + '/alumno';
  endPointPais = BASE_ENDPOINT + '/pais';
  endPointProvincia = BASE_ENDPOINT + '/provincia';
  endPointCiudad = BASE_ENDPOINT + '/ciudad';

  constructor(private http: HttpClient) { }

  listarPaginas(page: string, size: string): Observable<any> {
    const params = new HttpParams()
                                   .set('page', page)
                                   .set('size', size);
    return this.http.get<any>(this.endPointBase + '/paginator', { params: params });
  }

  listar(): Observable<Alumno[]> {
    return this.http.get<Alumno[]>(this.endPointBase);
  }

  getById(id: number): Observable<Alumno> {
    return this.http.get<Alumno>(this.endPointBase + '/' + id);
  }

  crear(alumno: Alumno): Observable<Alumno> {
    return this.http.post<Alumno>(this.endPointBase, alumno, { headers: this.cabeceras });
  }

  editar(alumno: Alumno): Observable<Alumno> {
    return this.http.put<Alumno>(this.endPointBase + '/' + alumno.id, alumno, { headers: this.cabeceras });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.endPointBase + '/' + id);
  }

  listarPaises(): Observable<Pais[]> {
    return this.http.get<Pais[]>(this.endPointPais);
  }

  obtenerUltimoLegajo(): Observable<number> {
    return this.http.get<number>(this.endPointBase + '/ultimo-legajo');
  }

  listarProvinciasByPais(idPais: number): Observable<Provincia[]> {
    return this.http.get<Provincia[]>(this.endPointProvincia + '/' + idPais + '/provincias');
  }

  listarCiudadesByProvincia(idProvincia: number): Observable<Ciudad[]> {
    return this.http.get<Ciudad[]>(this.endPointCiudad + '/' + idProvincia + '/ciudades');
  }
}
