import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../services/auth-store';

@Component({
  selector: 'app-navbar',
  standalone: true, // <--- IMPORTANTE: Añade esto
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html', // Asegúrate de que el archivo se llame navbar.html
  styleUrl: './navbar.css',
})
export class NavbarComponent { // <--- Cambiamos "Navbar" por "NavbarComponent"
  store = inject(AuthStore);
  router = inject(Router);

  logout() {
    this.store.clearSession();
    this.router.navigateByUrl('/login');
  }
}
