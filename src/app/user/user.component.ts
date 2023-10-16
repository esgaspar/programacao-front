import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from './model/user';
import { UserService } from './service/user.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackComponent } from '../snack/snack.component';


@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  isAdm: boolean = false;
  constructor(private formBuilder: FormBuilder, private service: UserService, private _snackBar: MatSnackBar) {
    this.service.getList().subscribe(
      {
        next: (v: User[]) => {
          this.list = v;
        },
        error: err => { this.openSnackBar("Erro ao recuperar lista de usuarios", "ok", "error"); console.error("Erro ao recuperar lista de usuarios", err) }
      })
  }



  list: User[] = [];

  form: FormGroup;
  myUser: User = new User();
  userSelected: User = new User();

  ngOnInit(): void {
    this.myUser = new User();
    this.myUser.email = "";

    if (sessionStorage.getItem("user") != null) {
      this.myUser = JSON.parse(sessionStorage.getItem("user") || '{}') || '';
      this.isAdm = this.myUser.roles.filter(v => v.name == 'admin').length > 0;

      this.userSelected = JSON.parse(JSON.stringify(this.myUser));
    }

    let regex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%*()_+^&}{:;?.])(?:([0-9a-zA-Z!@#$%;*(){}_+^&])(?!\1)){8,}$/;

    this.form = new FormGroup({
      id: new FormControl(this.myUser.id, [
      ]),
      name: new FormControl(this.myUser.name, [
        Validators.required,
        Validators.minLength(4)
      ]),
      username: new FormControl(this.myUser.username, [
        Validators.required,
        Validators.minLength(4)
      ]),
      email: new FormControl(this.myUser.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.myUser.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(regex)
      ])
    });

  }

  get name() { return this.form.get('name'); }
  get username() { return this.form.get('username'); }
  get email() { return this.form.get('email'); }
  get password() { return this.form.get('password'); }

  set name(name) { this.form.get('name')?.setValue(name); }
  set username(username) { this.form.get('username')?.setValue(username); }
  set email(email) { this.form.get('email')?.setValue(email); }
  set password(password) { this.form.get('password')?.setValue(password); }


  onSubmit() {
    let user: User = this.form.value;
    this.service.save(user).subscribe(
      {
        next: v => {
          this.openSnackBar("Salvo com sucesso", "ok", "sucess");
        },
        error: err => { this.openSnackBar("Erro ao salvar", "ok", "error"); console.error("Erro ao salvar", err) }
      })
  }

  openSnackBar(message: string, action: string, type: String) {
    let config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type: type, message: message, action: action };
    this._snackBar.openFromComponent(SnackComponent, config)
  }

  onSelectUser(user: User) {
    this.userSelected = user;
    this.form.setValue(user);
  }

  remove(user: User) {
    this.service.remove(user).subscribe({
      next: (value) => {
        this.openSnackBar("removido com sucesso", "", "sucess");
        this.list = this.list.filter(v => v.id != user.id);
      },
      error: (err) => {
        this.openSnackBar("erro ao remover", "ok", "sucess");
      },
      complete: () => {

      },
    })

  }
}
