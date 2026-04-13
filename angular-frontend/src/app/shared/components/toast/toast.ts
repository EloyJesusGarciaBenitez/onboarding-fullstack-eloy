import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Toast, ToastService } from '../../services/toast'; // Verifica que la ruta sea correcta

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html', 
  styleUrls: ['./toast.css']  
})
export class ToastComponent {
  toasts: Toast[] = [];

  constructor(private readonly toastService: ToastService) {
    this.toastService.toasts$.subscribe((t) => {
      this.toasts.push(t);
      const ttl = t.timeout ?? 3000;
      setTimeout(() => this.dismiss(t.id), ttl);
    });
  }

  dismiss(id: number): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
