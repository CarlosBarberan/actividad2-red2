import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  returnUrl: string = '/';
  showRegisterForm: boolean = false;
  
  // Campos para registro
  registerUsername: string = '';
  registerEmail: string = '';
  registerRole: string = 'customer';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/';
    });
  }

  onLogin(): void {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos';
    }
  }

  onRegister(): void {
    if (this.registerUsername && this.registerEmail) {
      const role = this.registerRole as any;
      if (this.authService.registerUser(this.registerUsername, this.registerEmail, role)) {
        this.errorMessage = '';
        this.showRegisterForm = false;
        this.registerUsername = '';
        this.registerEmail = '';
        this.registerRole = 'customer';
        alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión con contraseña: 123');
      } else {
        this.errorMessage = 'El usuario o email ya existe';
      }
    } else {
      this.errorMessage = 'Por favor completa todos los campos';
    }
  }
}
