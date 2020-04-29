import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Generic } from 'src/app/models/generic';

export abstract class CommonService<E extends Generic> {

  private baseEndPoint: string;
  protected cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(protected http: HttpClient) { }

  listarPaginas(page: string, size: string): Observable<any> {
    const params = new HttpParams()
                                   .set('page', page)
                                   .set('size', size);
    return this.http.get<any>(this.baseEndPoint + '/paginator', { params: params });
  }

  listar(): Observable<E[]> {
    return this.http.get<E[]>(this.baseEndPoint);
  }

  getById(id: number): Observable<E> {
    return this.http.get<E>(this.baseEndPoint + '/' + id);
  }

  crear(e: E): Observable<E> {
    return this.http.post<E>(this.baseEndPoint, e, { headers: this.cabeceras });
  }

  editar(e: E): Observable<E> {
    return this.http.put<E>(this.baseEndPoint + '/' + e.id, e, { headers: this.cabeceras });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(this.baseEndPoint + '/' + id);
  }
}
