import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task, TaskPayload, TaskFilters } from '../interfaces/tasks';

@Injectable({ providedIn: 'root' })
export class TaskApiService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8000/api'; 

  getTasks(filters?: TaskFilters): Observable<Task[]> {
    let params = new HttpParams();
    if (filters?.q) params = params.set('q', filters.q);
    if (filters?.estado) params = params.set('estado', filters.estado);
    return this.http.get<Task[]>(`${this.apiUrl}/tasks`, { params });
  }

  createTask(payload: TaskPayload): Observable<Task> {
    return this.http.post<Task>(`${this.apiUrl}/tasks`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/tasks/${id}`);
  }
}