import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../security/service/auth.service';
import { Router } from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  authService: AuthService;
  loginError: boolean = false;
  constructor(authService: AuthService, private router: Router) {
    this.authService = authService;
  }

  usernameFormControl = new FormControl('', [
    Validators.required
  ]);
  passwordFormControl = new FormControl('', [
    Validators.required
  ]);

  matcher = new MyErrorStateMatcher();

  login() {
    if (this.usernameFormControl.valid && this.passwordFormControl.valid) {
      this.authService.authenticate(this.usernameFormControl.value!, this.passwordFormControl.value!).subscribe({
        next: (result) => {
          console.log("logado"); this.router.navigate([""]);
        },
        error: (err) => { 
          this.loginError = true;
        },
        complete: () => { },
      })
    } else {
      this.usernameFormControl.markAsDirty();
      this.passwordFormControl.markAsDirty();
    }
  }

}
