import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TaskFilters } from '../../../../shared/interfaces/tasks';

@Component({
  selector: 'app-task-filters',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-filters.html',
  styleUrl: './task-filters.css'
})
export class TaskFiltersComponent {
  private fb = inject(FormBuilder);

  @Output() filtersChanged = new EventEmitter<TaskFilters>();

  // AQUÍ ESTÁ EL 'form' QUE TE PEDÍA EL ERROR
  form: FormGroup = this.fb.group({
    titulo: [''],
    estado: [''],
    prioridad: ['']
  });

  constructor() {
    // Escucha cambios en el formulario y avisa al padre
    this.form.valueChanges.subscribe(values => {
      this.filtersChanged.emit(values);
    });
  }

  // AQUÍ ESTÁ EL 'limpiar' QUE TE PEDÍA EL ERROR
  limpiar() {
    this.form.reset();
  }
}