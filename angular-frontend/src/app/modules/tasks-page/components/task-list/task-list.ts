import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { TaskApiService } from '../../../../shared/services/task-api';
import { Task, TaskFilters } from '../../../../shared/interfaces/tasks';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.html'
})
export class TaskListComponent implements OnInit {
  private api = inject(TaskApiService);
  
  loading$ = new BehaviorSubject<boolean>(false);
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(filters?: TaskFilters): void {
    this.loading$.next(true);
    this.api.getTasks(filters).pipe(
      finalize(() => this.loading$.next(false)),
      catchError(() => of([]))
    ).subscribe(tasks => this.tasksSubject.next(tasks));
  }

  borrarTarea(id: number): void {
    if (confirm('¿Seguro que quieres eliminar esta tarea?')) {
      this.api.deleteTask(id).subscribe({
        next: () => this.loadTasks(), // Refresca la lista tras borrar
        error: (err) => console.error('Error al borrar', err)
      });
    }
  }
}