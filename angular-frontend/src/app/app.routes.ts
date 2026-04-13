import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login-component/login-component';
import { RegisterComponent } from './modules/auth/register-component/register-component';
import { LandingPageComponent } from './modules/landing-page/landing-page'; 

// 1. Importamos los porteros (Guards)
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  
  { 
    path: 'tasks', 
    // 2. Protegemos la ruta de tareas: solo entra gente logueada
    canActivate: [authGuard],
    loadComponent: () => import('./modules/tasks-page/tasks-page')
      .then(m => m.TasksPageComponent) 
  },

  /* Si llegas a crear el panel de admin para el reto, sería así:
     { 
       path: 'admin', 
       canActivate: [authGuard, adminGuard], 
       loadComponent: () => import('./modules/admin/admin-dashboard')
         .then(m => m.AdminDashboardComponent)
     },
  */

  { path: '**', redirectTo: '' }
];