import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Imports de componentes hijos
import { TaskListComponent } from './components/task-list/task-list';
import { TaskFormComponent } from './components/task-form/task-form';
import { TaskFiltersComponent } from './components/task-filters/task-filters';

// RUTAS CORREGIDAS: He quitado un nivel de puntos porque 'shared' suele estar al mismo nivel que 'tasks-page' o uno arriba
import { ToastService } from '../../shared/services/toast';
import { TaskApiService } from '../../shared/services/task-api';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TaskFormComponent,
    TaskListComponent,
    TaskFiltersComponent
  ],
  templateUrl: './tasks-page.html'
})
export class TasksPageComponent {

  constructor(
    private toast: ToastService,
    private api: TaskApiService
  ) {}

  onTaskSubmitted(payload: any) {
    this.api.createTask(payload).subscribe({
      // Añadimos tipos :any para que TS no se queje
      next: (res: any) => {
        this.toast.success('¡Tarea guardada correctamente!');
        console.log('Respuesta:', res);
      },
      error: (err: any) => {
        console.error('Error:', err);
        const errorMsg = err.error?.message || 'Error al conectar con el servidor';
        this.toast.error('No se pudo guardar: ' + errorMsg);
      }
    });
  }

  onFiltersApply(filters: any) {
    this.toast.info('Aplicando filtros...');
    console.log('Filtros:', filters);
  }
}