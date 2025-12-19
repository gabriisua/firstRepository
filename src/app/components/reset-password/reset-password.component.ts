import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/Services/AuthService';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  form: FormGroup;
  message: string = '';
  token: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
  ) {
    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatch });

    this.form.get('newPassword')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());
    this.form.get('confirmPassword')?.valueChanges.subscribe(() => this.form.updateValueAndValidity());

  }

  /*ngOnInit(): void {
    // Se l'utente è loggato, reindirizza
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']); // o dove vuoi
      return;
    }

    // Prendi il token dalla query string
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.message = 'Token mancante o link non valido.';
       // this.router.navigate(['/login']); // token mancante => login
      }
    });
  }*/

  ngOnInit(): void {
  this.route.queryParams.subscribe(params => {
    // Prendi il token così com'è, senza trim o decode
    this.token = params['token'] || '';
    console.log('Token pronto per il backend:', this.token);
  });
}


  passwordsMatch(group: FormGroup) {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  if (!newPassword || !confirmPassword){
    return null;
  }
  return newPassword === confirmPassword ? null : { notMatching: true };
  
}


  submit() {
  if (this.form.invalid) return;

  const body = {
    token: this.token,
    newPassword: this.form.value.newPassword
  };

  this.http.post('http://localhost:5177/users/reset-password', body)
    .subscribe({
      next: () => {
        this.message = 'Password aggiornata con successo!';
        // Dopo un piccolo delay, reindirizza alla login
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500); // 1.5 secondi per dare tempo all'utente di leggere il messaggio
      },
      error: err => this.message = err.error || 'Errore nella richiesta'
    });
}

goToLogin(){
    this.router.navigate(['/login'])}
}
