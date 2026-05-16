import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Privilegio } from './model/privilegio';
import { PrivilegioService } from './service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';

@Component({
  selector: 'app-privilegio',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    CdkDrag,
    CdkDragPlaceholder,
    CdkDropList,
    FaIconComponent,
  ],
  templateUrl: './privilegio.component.html',
  styleUrls: ['./privilegio.component.css'],
})
export class PrivilegioComponent implements OnInit {
  list = signal<Privilegio[]>([]);

  constructor(
    private service: PrivilegioService,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.service.getList().subscribe((list: Privilegio[]) => {
      this.list.set(list);
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    const current = this.list();
    current[event.previousIndex].ordem = event.currentIndex;
    moveItemInArray(current, event.previousIndex, event.currentIndex);
    for (let i = 0; i < current.length; i++) {
      current[i].ordem = i;
    }
    this.list.set([...current]);

    this.service.saveAll(this.list()).subscribe({
      error: () => this.openSnackBar('Erro ao salvar', 'ok', 'error'),
    });
  }

  novo() {
    this.list.update(l => [new Privilegio(), ...l]);
  }

  salvar(privilegio: Privilegio, sendMsg = true) {
    privilegio.codigo = this.normalizeCodigo(privilegio.descricao);
    this.service.save(privilegio).subscribe({
      next: v => {
        if (sendMsg) this.openSnackBar('Salvo com sucesso', 'ok', 'sucess');
        privilegio.id = v.id;
      },
      error: () => this.openSnackBar('Erro ao salvar', 'ok', 'error'),
    });
  }

  openSnackBar(message: string, action: string, type: string) {
    const config = new MatSnackBarConfig();
    config.duration = 1000;
    config.data = { type, message, action };
    this._snackBar.openFromComponent(SnackComponent, config);
  }

  remove(toRemove: Privilegio) {
    this.service.remove(toRemove).subscribe({
      next: () => {
        this.openSnackBar('Removido com sucesso', 'ok', 'sucess');
        this.list.update(l => l.filter(v => v.id !== toRemove.id));
      },
      error: () => this.openSnackBar('Erro ao remover', 'ok', 'error'),
    });
  }

  normalizeCodigo(value: string | String) {
    return value
      .toLocaleLowerCase()
      .trim()
      .replace(/ /g, '-')
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '');
  }
}

