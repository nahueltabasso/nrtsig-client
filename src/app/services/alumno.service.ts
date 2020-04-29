import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Alumno } from '../models/alumno.models';

@Injectable({
  providedIn: 'root'
})
export class AlumnoService {

  endPointBase = 'http://localhost:8090/api/usuarios/alumno';
  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

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
}
