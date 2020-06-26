import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { BASE_ENDPOINT_CARRERAS } from '../config/app';
import { Observable } from 'rxjs';
import { PlanCarrera } from '../models/carrera.models';

@Injectable({
  providedIn: 'root'
})
export class PlancarreraService {

  cabeceras: HttpHeaders = new HttpHeaders({'Content-Type': 'application/json'});
  endPointBase = BASE_ENDPOINT_CARRERAS + '/plancarrera';

  constructor(private http: HttpClient) { }

  obtenerPlanCarreraVigente(idCarrera: number): Observable<PlanCarrera> {
    return this.http.get<PlanCarrera>(this.endPointBase + '/plan-carrera-vigente/' + idCarrera);
  }
}
