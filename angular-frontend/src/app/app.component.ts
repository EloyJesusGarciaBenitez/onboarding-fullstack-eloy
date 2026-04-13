import { Component, inject } from '@angular/core'; 
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // Necesario para el *ngIf
import { AuthStore } from './shared/services/auth-store';

// Imports de tus componentes
import { NavbarComponent } from './shared/components/navbar/navbar';
import { ToastComponent } from './shared/components/toast/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  // IMPORTANTE: Añadimos NavbarComponent y CommonModule aquí
  imports: [RouterOutlet, ToastComponent, NavbarComponent, CommonModule],
  templateUrl: './app.component.html',
})
export class AppComponent { 
  // Inyectamos el store para que el HTML sepa si mostrar la barra o no
  store = inject(AuthStore);
}
