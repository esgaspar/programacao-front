import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Privilegio } from '../privilegio/model/privilegio';
import { PrivilegioService } from '../privilegio/service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';
import { Voluntario } from './model/voluntario';
import { VoluntarioService } from './service/voluntario.service';

@Component({
    selector: 'app-voluntario',
    imports: [
        CommonModule,
        FormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDividerModule,
        MatProgressBarModule,
        FaIconComponent,
    ],
    templateUrl: './voluntario.component.html',
    styleUrls: ['./voluntario.component.scss']
})
export class VoluntarioComponent implements OnInit {
  list = signal<Voluntario[]>([]);
  privilegioList = signal<Privilegio[]>([]);
  busca = '';

  constructor(
    private service: VoluntarioService,
    private privilegioService: PrivilegioService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  openSnackBar(message: string, action: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type, message, action };
    this._snackBar.openFromComponent(SnackComponent, config);
  }

  getList() {
    this.service.getListByNome(this.busca).subscribe((list: Voluntario[]) => {
      this.list.set(list);
      this.privilegioService.getList().subscribe((privilegioList: Privilegio[]) => {
        this.privilegioList.set(privilegioList);
      });
    });
  }

  salvar(voluntario: Voluntario, sendMsg = true) {
    voluntario.isLoading = true;
    this.service.save(voluntario).subscribe({
      next: v => {
        if (sendMsg) this.openSnackBar('Salvo com sucesso', 'ok', 'sucess');
        voluntario.id = v.id;
      },
      error: () => this.openSnackBar('Erro ao salvar', 'ok', 'error'),
      complete: () => setTimeout(() => (voluntario.isLoading = false), 500),
    });
  }

  isDisabled(privilegio: Privilegio, list: Privilegio[]) {
    return list.filter(p => p.id === privilegio.id).length > 0;
  }

  alteraPrivilegio(voluntario: Voluntario, privilegio: any) {
    const tmp: Privilegio | undefined = voluntario.privilegioList.pop();
    if (tmp !== undefined) {
      tmp.descricao = privilegio.value.descricao;
      tmp.id = privilegio.value.id;
      tmp.status = 'novo';
      voluntario.privilegioList.push(tmp);
      this.salvar(voluntario);
    }
  }

  novoVoluntario() {
    this.list.update(l => [new Voluntario(), ...l]);
  }

  removeVoluntario(voluntario: Voluntario) {
    this.service.remove(voluntario).subscribe({
      next: () => {
        this.openSnackBar('Removido com sucesso', 'ok', 'sucess');
        this.list.update(l => l.filter(v => v.id !== voluntario.id));
      },
      error: () => this.openSnackBar('Erro ao remover', 'ok', 'error'),
    });
  }

  compareFn(p1: Privilegio, p2: Privilegio) {
    return p1 && p2 ? p1.id === p2.id : p1 === p2;
  }
}

