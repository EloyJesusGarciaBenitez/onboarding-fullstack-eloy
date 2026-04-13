import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../shared/services/auth-service';
import { AuthStore } from '../../../shared/services/auth-store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login-component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;

  private store = inject(AuthStore);
  private auth = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    
    this.auth.login(this.form.getRawValue()).subscribe({
      next: (res: any) => {
        this.store.setSession(res.token); 
        this.store.loadMe(); 
        this.router.navigateByUrl('/tasks');
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        alert('Error al iniciar sesión. Revisa tus datos.');
      },
    });
  }
}