import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { Unit, UnitPayload } from '../models/unit.model';

@Injectable({ providedIn: 'root' })
export class UnitsService {
  private readonly baseUrl = `${environment.apiUrl}/units`;

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    return token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : new HttpHeaders();
  }

  getUnits(): Observable<Unit[]> {
    return this.http.get<Unit[]>(this.baseUrl, {
      headers: this.getAuthHeaders()
    });
  }

  createUnit(payload: UnitPayload): Observable<Unit> {
    return this.http.post<Unit>(this.baseUrl, payload, {
      headers: this.getAuthHeaders()
    });
  }

  updateUnit(id: number, payload: Partial<UnitPayload>): Observable<Unit> {
    return this.http.put<Unit>(`${this.baseUrl}/${id}`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}
