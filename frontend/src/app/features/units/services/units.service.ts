import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Unit } from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class UnitsService {
  private readonly baseUrl = `${environment.apiUrl}/units`;

  constructor(private readonly http: HttpClient) {}

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl);
  }

  createUnit(payload: Partial<Unit>): Observable<Unit> {
    return this.http.post<Unit>(this.baseUrl, payload);
  }

  updateUnit(id: number, payload: Partial<Unit>): Observable<Unit> {
    return this.http.put<Unit>(`${this.baseUrl}/${id}`, payload);
  }
}
