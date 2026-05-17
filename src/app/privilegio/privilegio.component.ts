import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Privilegio } from './model/privilegio';
import { PrivilegioService } from './service/privilegio.service';
import { SnackComponent } from '../snack/snack.component';

@Component({
    selector: 'app-privilegio',
    imports: [
        FormsModule,
        MatButtonModule,
        MatTooltipModule,
        FaIconComponent,
    ],
    templateUrl: './privilegio.component.html',
    styleUrl: './privilegio.component.scss',
})
export class PrivilegioComponent implements OnInit {
  list = signal<Privilegio[]>([]);
  editingItem = signal<Privilegio | null>(null);

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

  moveUp(index: number) {
    if (index === 0) return;
    const list = [...this.list()];
    [list[index - 1], list[index]] = [list[index], list[index - 1]];
    this.saveOrder(list);
  }

  moveDown(index: number) {
    const list = [...this.list()];
    if (index === list.length - 1) return;
    [list[index], list[index + 1]] = [list[index + 1], list[index]];
    this.saveOrder(list);
  }

  saveOrder(list: Privilegio[]) {
    list.forEach((item, i) => item.ordem = i);
    this.list.set(list);
    this.service.saveAll(list).subscribe({
      error: () => this.openSnackBar('Erro ao salvar', 'ok', 'error'),
    });
  }

  novo() {
    const novoItem = new Privilegio();
    this.list.update(l => [novoItem, ...l]);
    this.editingItem.set(novoItem);
  }

  startEdit(item: Privilegio, event: Event) {
    event.stopPropagation();
    this.editingItem.set(item);
  }

  saveEdit(item: Privilegio, event: Event) {
    event.stopPropagation();
    if (!item.descricao?.trim()) return;
    this.editingItem.set(null);
    this.salvar(item);
  }

  cancelEdit(item: Privilegio, event: Event) {
    event.stopPropagation();
    this.editingItem.set(null);
    if (!item.id) {
      this.list.update(l => l.filter(v => v !== item));
    }
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

  normalizeCodigo(value: string) {
    return value
      .toLocaleLowerCase()
      .trim()
      .replace(/ /g, '-')
      .normalize('NFD')
      .replace(/\p{Mn}/gu, '');
  }
}
