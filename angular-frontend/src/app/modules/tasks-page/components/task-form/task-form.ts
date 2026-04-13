import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaskApiService } from '../../../../shared/services/task-api';
// 1. Importamos el servicio del Toast
import { ToastService } from '../../../../shared/services/toast';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './task-form.html'
})
export class TaskFormComponent {
  private fb = inject(FormBuilder);
  private api = inject(TaskApiService);
  // 2. Inyectamos el ToastService
  private toast = inject(ToastService);

  form: FormGroup = this.fb.group({
    titulo: ['', [Validators.required, Validators.minLength(3)]],
    descripcion: [''],
    estado: ['pendiente'],
    fechaLimite: ['']
  });

  onSubmit() {
    console.log('¡Botón pulsado!');
    
    if (this.form.valid) {
      console.log('Formulario válido, enviando datos...', this.form.value);
      
      this.api.createTask(this.form.value).subscribe({
        next: (res) => {
          console.log('✅ Guardado con éxito');
          // 3. Lanzamos Toast de éxito
          this.toast.success('¡Tarea creada con éxito!');
          
          this.form.reset({ estado: 'pendiente' });
          
          // OJO: reload() recargará la página y el Toast podría desaparecer 
          // muy rápido. Si quieres que se vea bien, quita el reload() 
          // o ponle un pequeño delay.
          setTimeout(() => window.location.reload(), 1500);
        },
        error: (err) => {
          console.error('❌ Error en el servidor:', err);
          // 4. Lanzamos Toast de error (ESTO ES LO QUE NECESITAS PARA LA FOTO)
          const msg = err.error?.detail || 'Error 400: Revisa los campos obligatorios';
          this.toast.error(msg);
        }
      });
    } else {
      // 5. Opcional: Avisar si el formulario está incompleto
      this.toast.warning('Por favor, rellena los campos obligatorios');
      console.log('❌ El formulario no es válido aún');
    }
  }
}