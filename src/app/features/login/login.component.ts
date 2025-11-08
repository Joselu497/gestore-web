import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../_core/services/auth.service';
import { Router } from '@angular/router';
import { CoreComponent } from '../../shared/components/core.component';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
})
export class LoginComponent extends CoreComponent implements OnInit {
  loginForm!: FormGroup;
  private _fb = inject(FormBuilder);
  private _authService = inject(AuthService);
  private _router = inject(Router);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this._authService
        .login(this.loginForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (res) => {
            this._router.navigate(['/']);
            this.isLoading.set(false);
          },
          error: (err) => {
            this.isLoading.set(false);
          },
        });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }
}
