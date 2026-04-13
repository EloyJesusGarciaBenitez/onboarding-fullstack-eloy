export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  estado: 'pendiente' | 'en progreso' | 'completada';
  fechaLimite?: string;
}

export interface TaskPayload extends Omit<Task, 'id'> {}

export interface TaskFilters {
  q?: string;
  estado?: string;
}