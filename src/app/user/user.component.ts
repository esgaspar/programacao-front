import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { User } from './model/user';
import { UserService } from './service/user.service';
import { SnackComponent } from '../snack/snack.component';

@Component({
  selector: 'user',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    FaIconComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  list = signal<User[]>([]);
  isAdm = false;
  form!: FormGroup;
  myUser: User = new User();
  userSelected: User = new User();

  constructor(
    private fb: FormBuilder,
    private service: UserService,
    private _snackBar: MatSnackBar,
  ) {
    this.service.getList().subscribe({
      next: (v: User[]) => this.list.set(v),
      error: err => {
        this.openSnackBar('Erro ao recuperar lista de usuarios', 'ok', 'error');
        console.error(err);
      },
    });
  }

  ngOnInit(): void {
    this.myUser = new User();
    this.myUser.email = '';

    if (sessionStorage.getItem('user') != null) {
      this.myUser = JSON.parse(sessionStorage.getItem('user') || '{}') || '';
      this.isAdm = this.myUser.roles.filter(v => v.name === 'admin').length > 0;
      this.userSelected = JSON.parse(JSON.stringify(this.myUser));
    }

    const regex =
      /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%*()_+^&}{:;?.])(?:([0-9a-zA-Z!@#$%;*(){}_+^&])(?!\1)){8,}$/;

    this.form = new FormGroup({
      id: new FormControl(this.myUser.id),
      name: new FormControl(this.myUser.name, [Validators.required, Validators.minLength(4)]),
      username: new FormControl(this.myUser.username, [
        Validators.required,
        Validators.minLength(4),
      ]),
      email: new FormControl(this.myUser.email, [Validators.required, Validators.email]),
      password: new FormControl(this.myUser.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(regex),
      ]),
      roles: this.fb.array(this.myUser.roles),
    });
  }

  get name() { return this.form.get('name'); }
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }
  get roles() { return this.form.get('roles'); }

  onSubmit() {
    const user: User = this.form.value;
    this.service.save(user).subscribe({
      next: () => this.openSnackBar('Salvo com sucesso', 'ok', 'sucess'),
      error: err => {
        this.openSnackBar('Erro ao salvar', 'ok', 'error');
        console.error(err);
      },
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type, message, action };
    this._snackBar.openFromComponent(SnackComponent, config);
  }

  onSelectUser(user: User) {
    this.userSelected = user;
    this.form.setValue(user);
  }

  remove(user: User) {
    this.service.remove(user).subscribe({
      next: () => {
        this.openSnackBar('removido com sucesso', '', 'sucess');
        this.list.update(l => l.filter(v => v.id !== user.id));
      },
      error: () => this.openSnackBar('erro ao remover', 'ok', 'sucess'),
    });
  }
}

